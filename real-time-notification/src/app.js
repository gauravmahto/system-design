import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { connectQueue } from "./config/rabbitmq.js";
import User from "./models/user.js";

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json());

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/notification_service")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// RabbitMQ Connection
let channel;
connectQueue()
  .then((ch) => (channel = ch))
  .catch((err) => console.error("RabbitMQ Error:", err));

// Send Notification API
app.post("/send-notification", async (req, res) => {
  const { userId, message } = req.body;

  const user = await User.findOne({ userId });
  if (!user) return res.status(404).json({ error: "User not found" });

  const notification = {
    userId,
    message,
    preferences: user.preferences,
    email: user.email,
    phoneNumber: user.phoneNumber,
  };

  channel.sendToQueue("notifications", Buffer.from(JSON.stringify(notification)));
  res.status(200).json({ message: "Notification sent to queue" });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
