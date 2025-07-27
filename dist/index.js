"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("./User"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const middleware_1 = require("./middleware");
const Content_1 = __importDefault(require("./Content"));
const config_1 = require("./config");
const uuid_1 = require("uuid");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:5173", // or your frontend's real origin
    credentials: true
}));
app.use(express_1.default.json());
mongoose_1.default.connect("mongodb://localhost:27017/brainly").then(() => console.log("Success"));
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(411).json({ message: "There is no input" });
        }
        const user = yield User_1.default.findOne({ username });
        if (user) {
            return res.status(403).json({ message: "User already exists with the name" });
        }
        const salt = bcryptjs_1.default.genSaltSync(10);
        const hashedPassword = bcryptjs_1.default.hashSync(password, salt);
        const newUser = new User_1.default({ username, password: hashedPassword });
        yield newUser.save();
        return res.status(200).json({ message: "User signed up" });
    }
    catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
}));
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(411).json({ message: "Error in inputs" });
        }
        const user = yield User_1.default.findOne({ username });
        if (!user) {
            return res.status(403).json({ message: "There is no user" });
        }
        const hash = bcryptjs_1.default.compareSync(password, user.password);
        if (!hash) {
            return res.status(403).json({ message: "Wrong password" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, config_1.jwt_password, { expiresIn: 60 * 60 * 60 });
        return res.status(200).json({ message: "Signedin", token: token });
    }
    catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
}));
app.post("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { link, type, title } = req.body;
        if (!link || !type || !title) {
            return res.status(411).json({ message: "There is no input of link or type" });
        }
        yield Content_1.default.create({
            link,
            title,
            type,
            //@ts-ignore
            userId: req.userId,
            tags: []
        });
        return res.status(201).json({ message: "Content added" });
    }
    catch (error) {
        console.log("Error" + error);
        return res.status(500).json({ message: error });
    }
}));
app.get("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        const id = req.userId;
        const contents = yield Content_1.default.find({ userId: id }).populate("userId", "username");
        return res.status(201).json({ content: contents });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
}));
app.delete("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    try {
        yield Content_1.default.deleteMany({
            _id: id,
            //@ts-ignore
            userId: req.userId
        });
        return res.status(201).json({ message: "Deleted" });
    }
    catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
}));
app.post("/api/v1/brain/share", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { share } = req.body;
        //@ts-ignore
        const userId = req.userId;
        const user = yield User_1.default.findById(userId);
        if (!user) {
            return res.status(402).json({ message: "User not found" });
        }
        if (share) {
            if (!user.shareLink) {
                user.shareLink = (0, uuid_1.v4)();
            }
            user.share = true;
            yield user.save();
            return res.status(201).json({ link: user.shareLink });
        }
        else {
            user.share = false;
            if (user.shareLink) {
                yield User_1.default.deleteOne({ shareLink: user.shareLink });
            }
            yield user.save();
            return res.status(402).json({ message: "You are not allowed" });
        }
    }
    catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
}));
app.get("/api/v1/brain/:shareLink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { shareLink } = req.params;
        const user = yield User_1.default.findOne({ shareLink, share: true });
        if (!user) {
            return res.status(401).json({ message: "Error in inputs" });
        }
        if (!shareLink || (user.shareLink !== shareLink)) {
            return res.status(404).json({ message: "Share link is invalid" });
        }
        if (!user.share) {
            return res.status(404).json({ message: "Sharing is disabled" });
        }
        const content = yield Content_1.default.find({ userId: user._id }).select("-__v").select("-userId");
        return res.status(200).json({
            username: user.username,
            content
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
}));
app.listen(3000);
