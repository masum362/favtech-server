import mongoose, { Schema } from "mongoose";

const reportedContentSchema = mongoose.Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "products",
    required: true,
  },
});

const reportedContentModel = new mongoose.model(
  "reportedContent",
  reportedContentSchema
);

export default reportedContentModel;
