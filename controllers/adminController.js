import userModel from "../model/userModel.js";
import productModel from "../model/productModel.js";
import reportedContentModel from "../model/reportedContentModel.js";
import reviewModel from "../model/productModel.js";
import couponModel from "../model/couponMode.js";

const getAllStatistics = async (req, res) => {
  console.log("called");
  try {
    const allUser = await userModel.estimatedDocumentCount();
    const allProduct = await productModel.estimatedDocumentCount();
    const allReview = await reviewModel.estimatedDocumentCount();

    console.log(allUser);

    // console.log({allUser, allProduct, allReview})
    const data = [
      {
        name: "users",
        value: allUser,
      },
      {
        name: "products",
        value: allProduct,
      },
      {
        name: "reviews",
        value: allReview,
      },
    ];
    return res.status(200).json(data);
    // return res.send("called");
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  console.log("called");
  const userId = req.userId;
  try {
    const response = await userModel.find({
      uid: {
        $ne: userId,
      },
    });

    return res.status(200).json(response);
  } catch (error) {
    return res.status(501).json({ message: error.message });
  }
};

const setRoleUser = async (req, res) => {
  console.log("called");
  const { role } = req.body;
  const { userId } = req.params;
  // const userId = req.userId;
  // const user = req.user;
  console.log(role);
  try {
    const user = await userModel.findOne({ uid: userId });
    if (user.role !== role) {
      const response = await userModel.updateOne({ uid: userId }, { role });
      return res.status(200).json(response);
    } else {
      return res.status(204).json({ message: `already user ${role}` });
    }
  } catch (error) {
    return res.status(501).json({ message: error.message });
  }
};

const removeRoleUser = async (req, res) => {
  console.log("called");
  const { userId } = req.params;
  // const userId = req.userId;
  // const user = req.user;
  try {
    const user = await userModel.findOne({ uid: userId });
    if (user.role !== "user") {
      const response = await userModel.updateOne(
        { uid: userId },
        { role: "user" }
      );
      return res.status(200).json(response);
    } else {
      return res.status(204).json({ message: `already user is a normal user` });
    }
  } catch (error) {
    return res.status(501).json({ message: error.message });
  }
};

const addCoupon = async (req, res) => {
  try {
    const { coupon } = req.body;

    const isAlradyCouponAdded = await couponModel.findOne({
      coupon_code: coupon.coupon_code,
    });

    if (isAlradyCouponAdded) {
      return res.status(204).json({ message: "coupon already added" });
    }

    const newCoupon = new couponModel(coupon);
    const response = await newCoupon.save();

    return res.status(200).json(response);
  } catch (error) {
    return res.status(501).json({ message: error.message });
  }
};

const getCoupons = async (req, res) => {
  try {
    const response = await couponModel.find({}).sort({ createdAt: -1 });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(501).json({ message: error.message });
  }
};

const getSigleCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;
    const coupon = await couponModel.findOne({ _id: couponId });

    return res.status(200).json(coupon);
  } catch (error) {
    return res.status(501).json({ message: error.message });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;
    const response = await couponModel.deleteOne({ _id: couponId });

    return res.status(200).json(response);
  } catch (error) {
    return res.status(501).json({ message: error.message });
  }
};

const updateCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;
    const { coupon_code, expiry_date, description, amount } = req.body.coupon;
    const coupon = await couponModel.findOne({ _id: couponId });

    coupon.coupon_code = coupon_code;
    coupon.amount = amount;
    coupon.description = description;
    coupon.expiry_date = expiry_date;
    const response = await coupon.save();

    return res.status(200).json(response);
  } catch (error) {
    return res.status(501).json({ message: error.message });
  }
};

export {
  getAllStatistics,
  setRoleUser,
  getUsers,
  removeRoleUser,
  addCoupon,
  getCoupons,
  getSigleCoupon,
  deleteCoupon,
  updateCoupon,
};
