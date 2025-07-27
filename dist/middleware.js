"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const userMiddleware = (req, res, next) => {
    console.log("Entered Middleware");
    const header = req.headers["authorization"];
    console.log("Header1" + header);
    if (!header) {
        console.log("Header2" + header);
        return res.status(401).json({ message: "Not getting header" });
    }
    console.log("Check 1 passed");
    try {
        const decoded = jsonwebtoken_1.default.verify(header, config_1.jwt_password);
        console.log(decoded);
        if (decoded) {
            //@ts-ignore
            req.userId = decoded.userId;
            next();
        }
    }
    catch (error) {
        console.log("Error" + error);
        res.status(500).json({ message: "Server Error" });
    }
};
exports.userMiddleware = userMiddleware;
