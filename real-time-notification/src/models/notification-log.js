import mongoose from "mongoose";

const NotificationLogSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  notificationType: { type: String, enum: ["email", "sms", "push"], required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ["sent", "failed"], default: "sent" },
  timestamp: { type: Date, default: Date.now },
});

const NotificationLog = mongoose.model("NotificationLog", NotificationLogSchema);
export default NotificationLog;
