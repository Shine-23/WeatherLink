import bcrypt from "bcryptjs";
import { User } from "../models/Users.mjs";
import { generateToken } from "../utils/jwt.mjs";
import { asyncHandler } from "../utils/asyncHandler.mjs";
import { ApiError } from "../utils/apiError.mjs";

export const registerUser = asyncHandler(async (req, res) => {
  const username = req.body?.username?.trim();
  const email = req.body?.email?.trim()?.toLowerCase();
  const password = req.body?.password;

  if (!username || !email || !password) {
    throw new ApiError(400, "Please provide all required fields");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  const token = generateToken(newUser);

  res.status(201).json({
    token,
    user: { id: newUser._id, username: newUser.username, email: newUser.email },
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const email = req.body?.email?.trim()?.toLowerCase();
  const password = req.body?.password;

  if (!email || !password) {
    throw new ApiError(400, "Please provide all required fields");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = generateToken(user);

  res.status(200).json({
    token,
    user: { id: user._id, username: user.username, email: user.email },
  });
});

export const googleCallback = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new ApiError(401, "OAuth failed");

  const token = generateToken(user);

  const clientUrl = process.env.CLIENT_URL;
  if (!clientUrl) throw new ApiError(500, "CLIENT_URL is not configured");

  const redirectUrl =
    `${clientUrl}/oauth-success` +
    `?token=${token}` +
    `&username=${encodeURIComponent(user.username)}`;

  res.redirect(redirectUrl);
});
