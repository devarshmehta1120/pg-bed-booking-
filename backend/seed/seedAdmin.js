const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const User = require("../models/User");
const connectDB = require("../config/db");

dotenv.config();

connectDB();

const seedAdmin = async () => {
  try {

    // check if admin already exists
    const adminExists = await User.findOne({ email: "admin@pg.com" });

    if (adminExists) {
      console.log("Admin already exists");
      process.exit();
    }

    // hash password
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // create admin
    const admin = await User.create({
      name: "Admin",
      email: "admin@pg.com",
      password: hashedPassword,
      role: "admin"
    });

    console.log("Admin created successfully");
    console.log(admin);

    process.exit();

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();