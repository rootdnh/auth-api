import mongoose from "mongoose";

const User = mongoose.model('Users', {
  name: String,
  email: String,
  password: String
});

export default User;