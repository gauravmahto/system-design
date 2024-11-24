import dotenv from "dotenv";
import { connectQueue } from "./config/rabbitmq.js";
import NotificationLog from "./models/notification-log.js";
import nodemailer from "nodemailer";

dotenv.config(); // Load environment variables

// Worker Logic
async function startWorker() {
  console.log("Worker process started...");
  const channel = await connectQueue();

  channel.consume("notifications", async (msg) => {
    const data = JSON.parse(msg.content.toString());
    const { userId, message, preferences, email } = data;

    try {
      if (preferences.email) {
        await sendEmail(email, message);
        await logNotification(userId, "email", message, "sent");
      }
      console.log(`Notification processed for user ${userId}`);
      channel.ack(msg);
    } catch (error) {
      console.error("Notification failed:", error);
      await logNotification(userId, "email", message, "failed");
    }
  });
}

async function sendEmail(to, content) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Notification Service",
    text: content,
  });
}

async function logNotification(userId, type, message, status) {
  await NotificationLog.create({
    userId,
    notificationType: type,
    message,
    status,
  });
}

startWorker();
