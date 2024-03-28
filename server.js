const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true, // allow session cookies from browser to back-end server,
    optionSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204,
  })
);
const userRoute = require("./routes/userRoute");
const profileRoute = require("./routes/profileRoute");
const postRoute = require("./routes/postRoute");
app.use("/api/user", userRoute);
app.use("/api/profile", profileRoute);
app.use("/api/post", postRoute);
module.exports = app;
