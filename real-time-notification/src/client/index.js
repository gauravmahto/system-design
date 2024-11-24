import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// API Endpoint from .env
const BASE_URL = process.env.BASE_URL;

// Sample Notification Data
const testNotification = {
  userId: "user123",  // Replace with an existing userId in your database
  message: "This is a test notification.",
};

// Function to Send Notification
async function sendNotification(data) {
  try {
    const response = await axios.post(`${BASE_URL}/send-notification`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Response:", response.data);
  } catch (error) {
    console.error("Error:", error.response ? error.response.data : error.message);
  }
}

// Run the Test
sendNotification(testNotification);
