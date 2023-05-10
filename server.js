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

server.get("/auth/register", async (req, res) => {
 const { name, mail, pass, confirm_pass } = req.body;

 if (!name) {
  res.status(422).json({ error: true, msg: "Name is a required field" });
 }
 if (!mail) {
  res.status(422).json({ error: true, msg: "Mail is a required field" });
 }
 if (!pass) {
  res.status(422).json({ error: true, msg: "Password is a required field" });
 }
 if (pass !== confirm_pass) {
  res.status(422).json({ error: true, msg: "Passwords is not match" });
 }
 //Check if user exists
 const existsUser = User.findOne({ email: email });

 if (existsUser) {
 }

 res.status(200).json({ name, mail, pass });
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
