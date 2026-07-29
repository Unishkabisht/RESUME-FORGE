const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// Register a new user
async function register(req, res) {
  try {
    // Step 1: Take the input value from body
    const { name, email, password } = req.body;

    // Step 2: Validate the input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    // Step 3: Check if the user already exists
    const alreadyExists = await User.count({
      where: {
        email
      }
    }); // select count(*) from users where email = '...'

    if (alreadyExists > 0) {
      return res.status(409).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Step 4: Create the user (password gets hashed automatically via model hook)
    const user = await User.create({
      name,
      email,
      password,
    }); // insert into users (name, email, password) values (...)

    const data = {
      userId: user.id,
    };

    // Step 5: Send success response
    return res.json({
      success: true,
      message: "User registered successfully",
      data
    });
  } catch (error) {
    console.log("error in register", error);
    return res.status(500).json({
      success: false,
      message: "Failed to register user."
    });
  }
}

// Login user
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // step 3: get user detail by email
    // select * from users where email="provided email" and name="provided name"
    const user = await User.findOne({
      where: {
        email
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials!"
      });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials!"
      });
    }

    // Step 4: Generate JWT Token
    const profile = {
      id: user.id,
      email: user.email,
      name: user.name
    };

    const token = jwt.sign(profile, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      success: true,
      message: "User logged in successfully",
      data: {
        token,
        user: profile
      }
    });
  } catch (e) {
    return res.status(400).json({
      success: false,
      message: "Internal server error",
      error: e.message
    });
  }
}

// Reset Password (verifies oldPassword and hashes newPassword directly)
async function resetPassword(req, res, next) {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Old password and new password are required"
      });
    }

    const user = await User.findOne({
      where: {
        id: req.userId
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials!"
      });
    }

    // step 3
    const isPasswordValid = bcrypt.compareSync(oldPassword, user.password || "");
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Old password is wrong"
      });
    }

    // step 4
    user.password = newPassword;
    await user.save(); // -> update users set password="you encr..."

    return res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
}

module.exports = {
  register,
  login,
  resetPassword
};
