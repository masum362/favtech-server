import mongoose, { Schema } from "mongoose";

const reviewSchema = mongoose.Schema({
    productId:{
        type:Schema.Types.ObjectId,
        ref:"products",
        required:true
    },
    reviewerName:{
        type:String,
        required:true
    },
    reviewerEmail:{
        type:String,
    },
    reviewerUid:{
        type:String,
        required:true
    },
    reviewerImage:{
        type:String,
        required:true
    },
    reviewDescription:{
    type:String,
    required:true
    },
    rating:{
        type:Number,
        required:true
    }

});

const reviewModel = new mongoose.model("review", reviewSchema);

export default reviewModel;
