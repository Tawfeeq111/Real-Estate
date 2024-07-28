import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
    try {
        const {username, email, password} = req.body;
        const hashedPassword = bcryptjs.hashSync(password, 10);
        const user = new User({
            username,
            email,
            password: hashedPassword
        })
        await user.save();
        res.status(201).json("User created successfully!");
    } catch (error) {
        next(error);
    }
}

export const signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const validUser = await User.findOne({email});
        if(!validUser){
            return next(errorHandler(404, "User not found!"));
        } 
        const isPassCorrect = bcryptjs.compareSync(password, validUser.password);
        console.log(isPassCorrect);
        if(!isPassCorrect){
            return next(errorHandler(404, "Invalid credentials!"));
        }
        const token = jwt.sign({id: validUser._id}, process.env.TOKEN_SECRET);
        validUser.password = undefined;
        res.cookie("access_token", token, { httpOnly: true })
            .status(200)
            .json(validUser);
    } catch (error) {
        next(error);
    }
}