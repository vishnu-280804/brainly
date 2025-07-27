import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
    title:String,
    type:String,
    link:String,
    tags:[{type:mongoose.Types.ObjectId,ref:'Tag'}],
    userId:{type:mongoose.Types.ObjectId,ref:'User',required:true},

});

const Content = mongoose.model("Content",contentSchema);

export default Content;