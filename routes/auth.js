import express, { Router } from "express";
import fs from "fs/promises";
import { addToDb } from "../utils/addToDb.js";
import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";
import { generateToken } from "../utils/jwt.js";
import { isAuthorized } from "../middleware/middleware.js";

const router = express.Router();

// Signup the user
router.post("/signup", async (req, res) => {
  try {
    // get user details
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(500).json({
        message: "Please provide all the details",
        success: false,
      });
    }

    // check if email already exists
    const user = await fs.readFile("./db/users.json", "utf-8");
    const parsedUser = JSON.parse(user);
    if (parsedUser.find((user) => user.email === email)) {
      return res.status(400).json({
        message: "This email already exists",
        success: false,
      });
    }

    // check if username already exists
    if (parsedUser.find((user) => user.username === username)) {
      return res.status(400).json({
        message: "This username already exists",
        success: false,
      });
    }

    // secure the password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    const newUser = {
      id: uuidV4(),
      username,
      email,
      password: hashedPass,
    };
    await addToDb(newUser, "./db/users.json");
    return res.json({
      data : {
        ...newUser
      },
      success : true
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error in signup part",
      success: false,
    });
  }
});

// Login the user
router.post("/login", async (req, res) => {
  try {
    //get user data
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).json({
        message: "Please provide all the details",
        success: false,
      });
    }

    // validate the user
    const users = await fs.readFile("./db/users.json", "utf-8");
    const parsedUser =  JSON.parse(users);
    const user = await parsedUser.find((user) => user.email === email);
    if (!users) {
      return res.status(404).json({
        message: "Invalid Email",
        success: false,
      });
    }

    // check is password is correct
    const hasValidPass = await bcrypt.compare(password, user.password);
    if (!hasValidPass) {
      return res.status(401).json({
        message: "Invalid password",
        success: false,
      });
    }

    // if everything cool, generate a jwt for user
    const token = generateToken({
      username: user.username,
      email: user.email,
      id: user.id,
    });

    return res.json({
      data: {
        token,
      },
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error in login part",
      success: false,
    });
  }
});


// fetches users data
router.get("/todos", isAuthorized, async (req, res) => {
  try {
    console.log(req.user);
    return res.json({
      message: "Everything works fine",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
});

export default router;
