import express from "express";
import {
  loginUser,
  registerUser,
  isAdminUser,
  isModeratorUser,
  paymentWithStripe,
  subscribeUser,
  useCoupon
} from "../controllers/userController.js";
import { verifyAdmin, verifyModerator, verifyToken } from "./auth.js";
import {
  addProduct,
  getUserProduct,
  deleteUserProduct,
  productReviewQueues,
  featureProduct,
  statusProduct,
  getReportedContents,
  addReportedContent,
  deleteReportedContent,
  addReview,
  getFeauredProducts,
  upVoteUser,
  getTrendingProducts,
  getProduct,
  getProductReviews,
  getAllProducts,
  getNumberOfProducts,
  updateProduct,
  
} from "../controllers/productController.js";
import {
  getAllStatistics,
  getUsers,
  removeRoleUser,
  setRoleUser,
  addCoupon,
  getCoupons,
  getSigleCoupon,
  deleteCoupon,
  updateCoupon,
} from "../controllers/adminController.js";

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

// admin only routes
router.get("/users", verifyToken, verifyAdmin, getUsers);
router.patch("/user/role/:userId", verifyToken, verifyAdmin, setRoleUser);
router.patch(
  "/user/role/remove/:userId",
  verifyToken,
  verifyAdmin,
  removeRoleUser
);

// product routes
router.get("/all-products", getAllProducts);
router.get("/number-of-products", getNumberOfProducts);
router.get("/featuredProduct", getFeauredProducts);
router.get("/trending-products", getTrendingProducts);
router.get("/product/:id", verifyToken, getProduct);
router.patch("/upvote/:productId", verifyToken, upVoteUser);
router.get("/get-user-all-products", verifyToken, getUserProduct);
router.get("/products", verifyToken, verifyModerator, productReviewQueues);
router.post("/add-product", verifyToken, addProduct);
router.patch("/update-product/:productId", verifyToken, updateProduct);

// moderator only routes
router.patch(
  "/product/feature/:productId",
  verifyToken,
  verifyModerator,
  featureProduct
);
router.patch(
  "/product/status/:productId",
  verifyToken,
  verifyModerator,
  statusProduct
);
router.delete(
  "/delete-user-product/:productId",
  verifyToken,
  deleteUserProduct
);

// reviews product
router.get("/get-reviews/:productId", getProductReviews);
router.post("/add-review", addReview);

// reported content routes
router.get("/get-reported-contents", getReportedContents);
router.post("/add-reported-content/:productId", addReportedContent);

router.delete(
  "/reported-content/delete/:productId",
  verifyToken,
  verifyModerator,
  deleteReportedContent
);

// coupons api
router.get("/coupons", getCoupons);
router.post("/use/coupon",verifyToken,useCoupon)


// get all admin routes
router.get("/statistics", verifyToken, verifyAdmin, getAllStatistics);
router.get("/coupon/:couponId", verifyToken, verifyAdmin, getSigleCoupon);
router.post("/add/coupon", verifyToken, verifyAdmin, addCoupon);
router.patch(
  "/update/coupon/:couponId",
  verifyToken,
  verifyAdmin,
  updateCoupon
);
router.delete(
  "/delete/coupon/:couponId",
  verifyToken,
  verifyAdmin,
  deleteCoupon
);

export default router;
