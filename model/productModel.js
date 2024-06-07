import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    imageURL: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    owner: {
      name: {
        type: String,
        required: true,
      },
      imageURL: {
        type: String,
        required: true,
      },
      email: {
        type: String,
      },
      uid: {
        type: String,
        required: true,
      },
    },
    tags: {
      type: [String],
      required: true,
    },
    externalLinks: {
      type: String,
      required: true,
    },
    upvote:{
      type:Number,
      default: 0,
    },
    downVoe:{
      type:Number,
      default: 0,
    },
    status:{
      type:String,
      default:"pending",
      enum:["pending", "accepted", "rejected"]
    }
  },
  { timestamps: true }
);

const productModel = new mongoose.model("products", productSchema);

export default productModel;
