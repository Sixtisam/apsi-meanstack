const express = require("express");
const bodyparser = require("body-parser");
const postmodel = require("./models/post");
const postroutes = require("./routes/posts");
const userRoutes = require("./routes/users");
const mongoose = require("mongoose");

require("dotenv").config();
console.log("env: ", process.env.MONGODB_URL);
mongoose
  .connect(process.env.MONGODB_URL, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to database");
  })
  .catch(() => {
    console.log("Connection Failed");
  });

const app = express();
app.use(bodyparser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});
app.use("/api/posts", postroutes);
app.use("/api/user", userRoutes);

module.exports = app;
