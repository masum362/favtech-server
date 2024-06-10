import productModel from "../model/productModel.js";
import reportedContentModel from "../model/reportedContentModel.js";
import userModel from "../model/userModel.js";
import reviewModel from "../model/reviewModel.js";

const addProduct = async (req, res) => {
  try {
    const { product } = req.body;

    const userId = req.userId;

    const user = await userModel.findOne({ uid: userId });

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

      const response = await newProduct.save();
      return res
        .status(200)
        .json({ response, message: "product added successfully" });
    }
    const isAlreadyAddedPostByUser = await productModel.findOne({
      "owner.uid": userId,
    });

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

      const response = await newProduct.save();
      return res
        .status(200)
        .json({ response, message: "product added successfully" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const updateProduct = async (req, res) => {
  console.log("called updateProduct");
  try {
    const { productId } = req.params;
    const { imageURL, name, description, tags, external_links } =
      req.body.product;
    const product = await productModel.findOne({ _id: productId });
    product.imageURL = imageURL;
    product.name = name;
    product.description = description;
    product.tags = tags;
    product.external_links = external_links;

    const response = await product.save();
    return res
      .status(200)
      .json({ response, message: "product updated successfully" });
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
        $sort: { statusOrder: 1, createdAt: -1 },
      },
    ];

    const products = await productModel.aggregate(pipeline);
    // const products = await productModel.find({}).sort({status:1});

    res.status(200).send(products);
  } catch (error) {
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

const statusProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { status } = req.body;

    const product = await productModel.findOne({ _id: productId });

    if (product.status === status) {
      return res.status(204).json({ message: `Already ${status} product!` });
    } else {
      const response = await productModel.updateOne(
        { _id: productId },
        { status: status }
      );
      return res.status(200).json({ message: "Success!", response });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getReportedContents = async (req, res) => {
  try {
    const contents = await reportedContentModel.find({}).populate("productId");
    return res.status(200).json(contents);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addReportedContent = async (req, res) => {
  try {
    const productId = req.params;
    const newContent = new reportedContentModel(productId);
    await newContent.save();
    return res.status(200).json(newContent);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteReportedContent = async (req, res) => {
  try {
    const { productId } = req.params;
    await reportedContentModel.deleteOne({
      productId,
    });
    await productModel.deleteOne({ _id: productId });
    return res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addReview = async (req, res) => {
  try {
    const reviewBody = req.body;
    // const review = {
    //   productId: "6663530629aabccc193f7963",
    //   reviewerName: "Md. masum ahmed",
    //   reviewerEmail: "masumahmed@gmail.com",
    //   reviewerUid: "ddsfldjldjld",
    //   reviewerImage: "https://i.ibb.co/BZ2FfFS/17197635-jpgf.jpg",
    //   reviewDescription: "something went wrong!",
    //   rating: 5,
    // };

    const newReview = new reviewModel(reviewBody);
    await newReview.save();
    return res.status(200).json(newReview);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await reviewModel.find({ productId: productId });
    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getFeauredProducts = async (req, res) => {
  try {
    const response = await productModel
      .find({ isFeatured: true })
      .sort({ createdAt: -1 });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getTrendingProducts = async (req, res) => {
  try {
    const response = await productModel.find().sort({ upvote: -1 });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const upVoteUser = async (req, res) => {
  const { userId } = req.body;
  const { productId } = req.params;

  try {
    const product = await productModel.findOne({ _id: productId });

    const isUserAlreadyVoted = product.upvotedUsers.includes(userId);

    if (isUserAlreadyVoted) {
      product.upvote -= 1;
      const filteredproductupvotedUsers = product.upvotedUsers.filter(
        (user) => user !== userId
      );
      product.upvotedUsers = filteredproductupvotedUsers;
      const response = await product.save();
      return res.status(200).json({ message: "User upvote removed", response });
    } else {
      product.upvote += 1;
      product.upvotedUsers.push(userId);
      const response = await product.save();
      return res
        .status(200)
        .json({ message: "User successfully voted", response });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await productModel.findOne({ _id: id });
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const getAllProducts = async (req, res) => {
  console.log("called");
  try {
    // const id = req.params.id;
    const { skip, limit, search } = req.query;
    const intSkip = parseInt(skip);
    const intLimit = parseInt(limit);
    // console.log({ skip, intSkip, intLimit });
    // const regex = new RegExp(search, "i");
    const regex = new RegExp(search, "i");
    const products = await productModel
      .find({ status: "accepted", tags: { $regex: regex } })
      .skip(intSkip)
      .limit(intLimit)
      .sort({ upvote: -1 });

    // console.log(products);
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const getNumberOfProducts = async (req, res) => {
  try {
    // const id = req.params.id;
    const numberOfProducts = await productModel.countDocuments({
      status: "accepted",
    });

    return res.status(200).json(numberOfProducts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export {
  addProduct,
  updateProduct,
  getUserProduct,
  deleteUserProduct,
  productReviewQueues,
  featureProduct,
  statusProduct,
  getReportedContents,
  addReportedContent,
  deleteReportedContent,
  addReview,
  getProductReviews,
  getFeauredProducts,
  getTrendingProducts,
  upVoteUser,
  getProduct,
  getAllProducts,
  getNumberOfProducts,
};
