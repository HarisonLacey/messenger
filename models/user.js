// user model

import mongoose from "mongoose";
const Schema = mongoose.Schema;

const User = new Schema({
  name: String,
  city: String,
  newUser: Boolean,
  messages: [],
});

export default mongoose.models.users || mongoose.model("users", User);
