import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "./User";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import { userMiddleware } from "./middleware";
import Content from "./Content";
import { jwt_password } from "./config";
import {v4 as uuidv4} from "uuid";
dotenv.config();
const app = express();
app.use(cors({
  origin: "http://localhost:5173", // or your frontend's real origin
  credentials: true
}));

app.use(express.json());
mongoose.connect("mongodb://localhost:27017/brainly").then(()=>console.log("Success"));

app.post("/api/v1/signup",async (req,res)=>{
   try {
     const {username,password} = req.body;
 
     if(!username || !password){
         return res.status(411).json({message:"There is no input"});
     }
 
     const user = await User.findOne({username});
 
     if(user){
         return res.status(403).json({message:"User already exists with the name"});
     }
     const salt = bcrypt.genSaltSync(10);
     const hashedPassword = bcrypt.hashSync(password,salt);
     const newUser = new User({username,password:hashedPassword});
     await newUser.save();
     return res.status(200).json({message:"User signed up"});
   } catch (error) {
     return res.status(500).json({message:"Server error"});
   }
});

app.post("/api/v1/signin",async (req,res)=>{
    try {
        const {username,password} = req.body;

        if(!username || !password){
            res.status(411).json({message:"Error in inputs"});
        }
            const user = await User.findOne({username});
            if(!user){
                return res.status(403).json({message:"There is no user"});
            }
            const hash = bcrypt.compareSync(password,user.password);
            if(!hash){
                return res.status(403).json({message:"Wrong password"});
            }
            const token = jwt.sign({userId:user._id},jwt_password,{expiresIn:60*60*60});
            return res.status(200).json({message:"Signedin",token:token});
     } catch (error) {
        return res.status(500).json({message:"Server error"});
    }
});

app.post("/api/v1/content",userMiddleware,async (req,res)=>{
   try {
     const {link,type,title} = req.body;
     if(!link || !type || !title){
         return res.status(411).json({message:"There is no input of link or type"});
     }
     await Content.create({
         link,
         title,
         type,
         //@ts-ignore
         userId: req.userId,
         tags:[]
 
     });
     return res.status(201).json({message:"Content added"});
   } catch (error) {
       console.log("Error"+error);
        return res.status(500).json({message:error});
   }
});
app.get("/api/v1/content",userMiddleware,async (req,res)=>{
    try {
        //@ts-ignore
        const id = req.userId;
        
        const contents = await Content.find({userId:id}).populate("userId","username");
        return res.status(201).json({content:contents});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Server error"});
    }
});

app.delete("/api/v1/content",userMiddleware,async (req,res)=>{
    const {id} = req.body;
    
    try {
        await Content.deleteMany({
            _id:id,
            //@ts-ignore
            userId:req.userId
        });

        return res.status(201).json({message:"Deleted"});
    } catch (error) {
        return res.status(500).json({message:"Server error"});
    }
    
})

app.post("/api/v1/brain/share",userMiddleware,async (req,res)=>{
    try {
        const {share} = req.body;
        
        //@ts-ignore
        const userId = req.userId;
        const user = await User.findById(userId);
        if(!user){
            return res.status(402).json({message:"User not found"});
        }
        if(share){
            if(!user.shareLink){
                user.shareLink = uuidv4();
            }
            user.share = true;
            await user.save();
            return res.status(201).json({link:user.shareLink});
        }
        else{
            user.share = false;
            if(user.shareLink){
                await User.deleteOne({shareLink:user.shareLink})
            }
            await user.save();
            return res.status(402).json({message:"You are not allowed"});
        }
    } catch (error) {
        return res.status(500).json({message:"Server Error"});
    }
});

app.get("/api/v1/brain/:shareLink",async(req,res)=>{
    try {
        const { shareLink } = req.params;

        const user = await User.findOne({shareLink,share:true});
        
        if(!user){
            return res.status(401).json({message:"Error in inputs"})
        }

        if(!shareLink || (user.shareLink !== shareLink)){
            return res.status(404).json({message:"Share link is invalid"});
        }

        if(!user.share){
            return res.status(404).json({message:"Sharing is disabled"});
        }

        const content = await Content.find({userId:user._id}).select("-__v").select("-userId");

        return res.status(200).json({
            username:user.username,
            content
        })
        
    } catch (error) {
        return res.status(500).json({message:"Server Error"});
    }
});
app.listen(3000);