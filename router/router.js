import express from "express";
import { loginUser, registerUser } from "../controllers/userController.js";

const router = express.Router();


router.get("/",(req, res )=> {
    console.log("called home");
    res.send("Welcome to the home page");
})

router.get("/register",registerUser)
router.get("/login",loginUser)


export default router;