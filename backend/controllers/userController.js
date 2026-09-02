/**
 * userController.js
 *
 * Handles user registration and authentication.
 *
 * Routes:
 *  POST /api/users/register  – Register a new user account
 *  POST /api/users/login     – Authenticate and return a JWT
 */

import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

/**
 * Generate a signed JWT for the given user ID.
 *
 * @param   {string} userId  The MongoDB ObjectId of the user
 * @returns {string}         A JWT valid for 7 days
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ---------------------------------------------------------------------------
// REGISTER
// ---------------------------------------------------------------------------

/**
 * @route   POST /api/users/register
 * @access  Public
 * @desc    Create a new user account. Passwords are hashed with bcrypt before
 *          storage. Returns the new user object and a JWT on success.
 *
 * @body  {string} username
 * @body  {string} email      Must be unique
 * @body  {string} password   Minimum 6 characters recommended
 * @body  {string} [role]     "user" (default) or "host"
 *
 * @returns {201} { _id, username, email, role, token }
 * @returns {400} If required fields are missing or the email is already taken
 */
export const registerUser = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    // Validate all required fields
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    // Prevent duplicate email registrations
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "A user with this email already exists" });
    }

    // Hash the password — bcrypt with 10 salt rounds is a strong default
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    // Return the new user's public details along with a JWT
    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      token: generateToken(newUser._id),
    });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------------------
// LOGIN
// ---------------------------------------------------------------------------

/**
 * @route   POST /api/users/login
 * @access  Public
 * @desc    Authenticate a user with email and password. Returns user details
 *          and a JWT on success.
 *
 *          Intentionally uses an identical error message for "email not found"
 *          and "wrong password" to prevent email enumeration attacks.
 *
 * @body  {string} email
 * @body  {string} password
 *
 * @returns {200} { _id, username, email, role, token }
 * @returns {400} If email or password fields are missing
 * @returns {401} If credentials are invalid
 */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate required fields before hitting the database
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // Find the user account; use the same error message regardless of what
    // was wrong (no email found vs wrong password) to prevent enumeration
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the plain-text password against the stored bcrypt hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Return public user data and a fresh JWT
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};
