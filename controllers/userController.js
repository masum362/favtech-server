import jwt from "jsonwebtoken";
import userModel from "../model/userModel.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
};

const registerUser = async (req, res) => {
  try {
    const user = req.body;
    console.log(user);
    const isAlreadyRegistered = await userModel.findOne({
      uid: user.uid,
    });
    if (isAlreadyRegistered?.displayName) {
      console.log("called from first stage");
      return res.status(200).json({ message: "Already Registered" });
    } else if (isAlreadyRegistered) {
      console.log("called from second stage");
      const response = await userModel.updateOne(
        { uid: isAlreadyRegistered.uid },
        { displayName: user.displayName, photoURL: user.photoURL }
      );
      return res.status(200).json({ message: "Already Registered", response });
    }

    const newUser = new userModel(user);
    await newUser.save();
    return res
      .status(200)
      .json({ message: "user registered successfully", newUser });
  } catch (error) {
    return res.status(501).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log(userId);
    const isUser = await userModel.findOne({ uid: userId });
    if (!isUser) {
      return res.status(404).json({ message: "Invalid User" });
    }
    const token = jwt.sign({ id: isUser.uid }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    console.log(token);
    return res
      .cookie("token", token, cookieOptions)
      .json({ token, user: isUser });
  } catch (error) {
    return res.status(501).json({ message: error.message });
  }
};

const isAdminUser = async (req, res) => {
  const { id } = req.params;
  console.log({id});

  if (req.userId !== id) {
    return res.status(403).json({ message: "invalid user" });
  } else {
    const query = { uid:id };
    const user = await userModel.findOne(query);
    let admin = false;
    if (user) {
      admin = user?.role === 'admin';
    }
    res.status(200).json({ admin });

  }
};

// const isAdminUser = async (req, res) => {
//   const { id } = req.params;
//   console.log({id});

//   if (req.userId !== id) {
//     return res.status(403).json({ message: "invalid user" });
//   } else {
//     const query = { uid:id };
//     const user = await userModel.findOne(query);
//     let admin = false;
//     if (user) {
//       admin = user?.role === 'admin';
//     }
//     res.status(200).json({ admin });

//   }
// };

export { registerUser, loginUser, isAdminUser };
