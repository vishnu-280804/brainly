import { NextFunction,Request,Response } from "express";
import jwt from "jsonwebtoken";
import { jwt_password } from "./config";

export const userMiddleware = (req:Request,res:Response,next:NextFunction)=>{
        console.log("Entered Middleware");
        const header = req.headers["authorization"];
        console.log("Header1"+header);
        if(!header){
            console.log("Header2"+header);

            return res.status(401).json({message:"Not getting header"});
        }
        console.log("Check 1 passed");
        try {
        const decoded = jwt.verify(header as string,jwt_password);
            console.log(decoded);
            if(decoded){
                //@ts-ignore
                req.userId = decoded.userId;
                next();
            }        
        } catch (error) {
        console.log("Error"+error);
        res.status(500).json({message:"Server Error"});
        }
}