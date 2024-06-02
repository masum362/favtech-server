import mongoose, { mongo } from "mongoose";

const userSchema = mongoose.Schema({
    displayName:{
        type:String,
        required:true,
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
    }

})


const userModel = new mongoose.model("users",userSchema);


export default userModel;