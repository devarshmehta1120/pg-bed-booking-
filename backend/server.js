require("dotenv").config();
const http = require("http");
const express = require("express");
const connectDB = require("./config/db");
const { app } = require("./app");
const { Server } = require("socket.io");


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

global.io = io;

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.use(express.json());

connectDB();
  

const PORT = process.env.PORT || 5000;
console.log(process.env.EMAIL);
console.log(process.env.EMAIL_PASSWORD);
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});