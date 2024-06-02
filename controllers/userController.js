import jwt from "jsonwebtoken";
import userModel from "../model/userModel.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
};

const registerUser = async (req, re) => {
  try {
    const user = req.body;

    const isAlreadyRegistered = await userModel.findOne({
      uid: user.uid,
    });
    if (isAlreadyRegistered) {
      return res.status(403).json({ message: "Already Registered" });
    }
    const response = await userModel.insertOne(user);
    return res.status(201).json(response);
  } catch (error) {
    return res.status(501).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const userId = req.body;
    const isUser = await userModel.findOne({ uid: userId });
    if (!isUser) {
      return res.status(404).json({ message: "Invalid User" });
    }
    const token = jwt.sign({ id: isUser.uid }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res.cookie("token", token, cookieOptions);
  } catch (error) {
    return res.status(501).json({ message: error.message });
  }
};
export { registerUser,loginUser };
