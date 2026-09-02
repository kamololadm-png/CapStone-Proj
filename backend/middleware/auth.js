import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * @middleware protect
 * @description Verifies the JWT from the Authorization header and attaches
 *              the authenticated user to req.user. Must be used before any
 *              route that requires a logged-in user.
 *
 * @header  Authorization  Bearer <token>
 * @sets    req.user        The authenticated User document (password excluded)
 *
 * @throws  401  If no token is provided, the token is invalid, or the user no
 *               longer exists in the database.
 */
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Reject requests that don't carry a Bearer token
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }

  try {
    const token = authHeader.split(" ")[1];

    // Verify signature and expiry against JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (exclude password from the document)
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

/**
 * @middleware hostOnly
 * @description Ensures the authenticated user has the "host" role.
 *              Must be used AFTER the `protect` middleware so that req.user
 *              is already populated.
 *
 * @throws  403  If the authenticated user's role is not "host".
 */
export const hostOnly = (req, res, next) => {
  if (req.user && req.user.role === "host") {
    return next();
  }
  return res.status(403).json({
    message: "Access denied: only hosts can perform this action",
  });
};
