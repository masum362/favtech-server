import mongoose, { mongo } from "mongoose";

const userSchema = mongoose.Schema({
    displayName:{
        type:String,
    },
    email:{
        type:String,
    },
    uid:{
        type:String,
        required:true,
    },
    photoURL:{
        type:String,
    },
    role:{
        type:String,
        default:"user",
        enum:["admin", "moderator","user"]
    }

})


const userModel = new mongoose.model("users",userSchema);


export default userModel;