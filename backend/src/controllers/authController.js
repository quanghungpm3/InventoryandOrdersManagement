// @ts-nocheck
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import Session from "../models/Session.js";

// TTL
const ACCESS_TOKEN_TTL = "30m"; // access token ngắn hạn
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // refresh token 14 ngày

const isProd = process.env.NODE_ENV === "production";

/* ================= SIGN UP ================= */
export const signUp = async (req, res) => {
  try {
    const { username, password, email, firstName, lastName } = req.body;

    if (!username || !password || !email || !firstName || !lastName) {
      return res.status(400).json({
        message: "Không thể thiếu username, password, email, firstName, lastName",
      });
    }

    const duplicate = await User.findOne({ username });
    if (duplicate) {
      return res.status(409).json({ message: "Username đã tồn tại" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      hashedPassword,
      email,
      displayName: `${firstName} ${lastName}`,
    });

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Lỗi khi gọi signUp:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

/* ================= SIGN IN ================= */
export const signIn = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Thiếu username hoặc password." });
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "Username hoặc password không đúng" });

    const valid = await bcrypt.compare(password, user.hashedPassword);
    if (!valid) return res.status(401).json({ message: "Username hoặc password không đúng" });

    // Access token
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL }
    );

    // Refresh token
    const refreshToken = crypto.randomBytes(64).toString("hex");

    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });

    // Gửi cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: REFRESH_TOKEN_TTL,
    });

    return res.status(200).json({
      message: `User ${user.displayName} logged in!`,
      accessToken,
    });
  } catch (error) {
    console.error("Lỗi khi gọi signIn:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

/* ================= SIGN OUT ================= */
export const signOut = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      await Session.deleteOne({ refreshToken: token });
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
      });
    }
    return res.sendStatus(204);
  } catch (error) {
    console.error("Lỗi khi gọi signOut:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

/* ================= REFRESH TOKEN ================= */
export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ message: "Token không tồn tại" });

    const session = await Session.findOne({ refreshToken: token });
    if (!session) return res.status(403).json({ message: "Token không hợp lệ hoặc hết hạn" });

    if (session.expiresAt < new Date()) {
      await Session.deleteOne({ refreshToken: token }); // xóa session hết hạn
      return res.status(403).json({ message: "Token đã hết hạn" });
    }

    const accessToken = jwt.sign(
      { userId: session.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL }
    );

    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Lỗi khi gọi refreshToken:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
