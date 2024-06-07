import express from "express";
import {
  loginUser,
  registerUser,
  isAdminUser,
  isModeratorUser,
  paymentWithStripe,
  subscribeUser,
} from "../controllers/userController.js";
import { verifyModerator, verifyToken } from "./auth.js";
import {
  addProduct,
  getUserProduct,
  deleteUserProduct,
  productReviewQueues,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", (req, res) => {
  console.log("called home");
  res.send("Welcome to the home page");
});

// user routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users/admin/:id", verifyToken, isAdminUser);
router.get("/users/moderator/:id", verifyToken, isModeratorUser);
router.post("/create-payment-intent", verifyToken, paymentWithStripe);
router.post("/payment/subscribe", verifyToken, subscribeUser);

// product routes
router.get("/get-user-all-products", verifyToken, getUserProduct);
router.get("/products", verifyToken, verifyModerator, productReviewQueues);
router.post("/add-product", verifyToken, addProduct);
router.delete(
  "/delete-user-product/:productId",
  verifyToken,
  deleteUserProduct
);

export default router;
