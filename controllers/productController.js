import productModel from "../model/productModel.js";
import userModel from "../model/userModel.js";

const addProduct = async (req, res) => {
  try {
    const { product } = req.body;
    console.log(product);
    const userId = req.userId;

    const user = await userModel.findOne({ uid: userId });
    console.log(user);
    if (user.isSubscribed) {
      const newProduct = new productModel({
        ...product,
        owner: {
          name: user.displayName,
          photoURL: user.photoURL,
          email: user.email,
          uid: user.uid,
        },
      });

      console.log({ newProduct });
      const response = await newProduct.save();
      return res
        .status(200)
        .json({ response, message: "product added successfully" });
    }
    const isAlreadyAddedPostByUser = await productModel.findOne({
      "owner.uid": userId,
    });

    console.log({ isAlreadyAddedPostByUser });

    if (isAlreadyAddedPostByUser) {
      return res
        .status(204)
        .json({ message: "You touched your product adding limit" });
    } else {
      const newProduct = new productModel({
        ...product,
        owner: {
          name: user.name,
          imageURL: user.imageURL,
          email: user.email,
          uid: user.uid,
        },
      });
      console.log({ newProduct });
      const response = await newProduct.save();
      return res
        .status(200)
        .json({ response, message: "product added successfully" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUserProduct = async (req, res) => {
  try {
    const userId = req.userId;
    const products = await productModel.find({ "owner.uid": userId });
    return res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteUserProduct = async (req, res) => {
  try {
    const userId = req.userId;
    const productId = req.params.productId;

    const response = await productModel.deleteOne({
      _id: productId,
      "owner.uid": userId,
    });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const productReviewQueues = async (req, res) => {
  const userId = req.userId;
  try {
    const pipeline = [
      {
        $addFields: {
          statusOrder: {
            $switch: {
              branches: [
                { case: { $eq: ["$status", "pending"] }, then: 0 },
                { case: { $eq: ["$status", "accepted"] }, then: 1 },
                { case: { $eq: ["$status", "rejected"] }, then: 2 },
              ],
              default: 3,
            },
          },
        },
      },
      {
        $sort: { statusOrder: 1 },
      },
    ];

    const products = await productModel.aggregate(pipeline);
    // const products = await productModel.find({}).sort({status:1});
    console.log({ products });
    res.status(200).send(products);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

const featureProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await productModel.findOne({ _id: productId });

    if (product.isFeatured) {
      return res.status(204).json({ message: "Already featured product!" });
    } else {
      const response = await productModel.updateOne(
        { _id: productId },
        { isFeatured: true }
      );
      return res.status(200).json({ message: "Success!", response });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const acceptProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await productModel.findOne({ _id: productId });

    if (product.status ==="accepted") {
      return res.status(204).json({ message: "Already accepted product!" });
    } else {
      const response = await productModel.updateOne(
        { _id: productId },
        { status: "accepted" }
      );
      return res.status(200).json({ message: "Success!", response });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { addProduct, getUserProduct, deleteUserProduct, productReviewQueues,featureProduct ,acceptProduct};
