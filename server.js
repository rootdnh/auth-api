import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import mongoose from "mongoose";
const server = express();

//middlewares
server.use(bodyParser.json());

//Models
import User from "./models/User.js";

//Routes
server.get("/", (req, res) => {
 res.status(200).json({ msg: "Welcome to auth api" });
});

server.post("/auth/register", async (req, res) => {
 const { name, email, password, confirm_pass } = req.body;

 if (!name) {
  res.status(422).json({ error: true, msg: "Name is a required field" });
 }
 if (!email) {
  res.status(422).json({ error: true, msg: "Mail is a required field" });
 }
 if (!password) {
  res.status(422).json({ error: true, msg: "Password is a required field" });
 }
 if (password !== confirm_pass) {
  res.status(422).json({ error: true, msg: "Passwords is not match" });
 }
 //Check if user exists
 const existsUser = await User.findOne({ email: email });
 if (existsUser) {
  console.log(existsUser);
  res.status(422).json({ error: true, msg: "This email is already in use" });
 } else {
  //Create a password cryptography
  const salt = await bcrypt.genSalt(11);
  const passCrypt = await bcrypt.hash(password, salt);

  //Create a new User
  const newUser = new User({
   name,
   email,
   password: passCrypt,
  });

  try {
   await newUser.save();
   res.status(201).json({ error: false, msg: "User is successfully created" });
  } catch (error) {
   res.status(500).json({ error: true, msg: "Internal server error" });
  }
 }
});

server.post("/auth/login", async (req, res) => {
 const { email, password } = req.body;

 if (!email) {
  res.status(422).json({ error: true, msg: "Mail is a required field" });
 }
 if (!password) {
  res.status(422).json({ error: true, msg: "Password is a required field" });
 }

 //Check if user exists
 const userLogin = await User.findOne({ email: email });

 if (!userLogin) {
  res.status(404).json({ error: true, msg: "User not found" });
 } else {
  const checkPassword = await bcrypt.compare(password, userLogin.password);
  checkPassword
   ? res.status(200).json({ error: false, msg: "The user has been successfully logged" })
   : res.status(422).json({ error: true, msg: "The password is not match" });
 }
});

//Connection with database MONGODB ATLAS
mongoose
 .connect(process.env.MONGO_URL)
 .then(() => {
  server.listen(process.env.PORT, () => {
   console.log(
    "Database is connected and app is running at port",
    process.env.PORT
   );
  });
 })
 .catch((error) => {
  console.log("Error mongoose", error);
 });
