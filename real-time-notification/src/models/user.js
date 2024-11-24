import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  phoneNumber: { type: String },
  preferences: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    pushNotification: { type: Boolean, default: false },
  },
});

const User = mongoose.model("User", UserSchema);
export default User;
