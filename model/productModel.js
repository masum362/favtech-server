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
    external_links: {
      type: String,
      required: true,
    },
    upvote:{
      type:Number,
      default: 0,
    },
    upvotedUsers:{
      type: [String],
  },
    downVoe:{
      type:Number,
      default: 0,
    },
    status:{
      type:String,
      default:"pending",
      enum:["pending", "accepted", "rejected"]
    },
    isFeatured:{
      type:Boolean,
      default:false,
    }
  },
  { timestamps: true }
);

const productModel = new mongoose.model("products", productSchema);

export default productModel;
