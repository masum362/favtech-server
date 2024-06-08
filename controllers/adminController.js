import userModel from "../model/userModel.js";
import productModel from "../model/productModel.js";
import reportedContentModel from "../model/reportedContentModel.js";
import reviewModel from "../model/productModel.js";

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
  try {
    const response = await userModel.find({});

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

export { getAllStatistics, setRoleUser, getUsers };
