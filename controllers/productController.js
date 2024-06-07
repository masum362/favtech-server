import productModel from "../model/productModel";
import userModel from "../model/userModel";

const addProduct = async () => {
  try {
    const { product } = req.body;
    const userId = req.userId;
    const user = await userModel.findOne({ uid: userId });

    if (user.isSubscribed) {
      const newProduct = new productModel(product);
      const response = await newProduct.save();
      return res
        .status(200)
        .json({ response, message: "product added successfully" });
    }
    const isAlreadyAddedPostByUser = await productModel.findOne({
      "author.uid": userId,
    });

    console.log({ isAlreadyAddedPostByUser });

    if (isAlreadyAddedPostByUser) {
      return res
        .status(501)
        .json({ message: "You touch your product adding limit" });
    } else {
      const newProduct = new productModel(product);
      const response = await newProduct.save();
      return res
        .status(200)
        .json({ response, message: "product added successfully" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { addProduct };
