import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs"


export const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = req.user;
        if(id != user.id){
            next(errorHandler(401, "You can only update your own account!"))
        }
        if(req.body.password){
            req.body.password = bcryptjs.hashSync(req.body.password, 10)
        }
        const updatedUser = await User.findByIdAndUpdate(id, {
            $set: {
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                avatar: req.body.avatar
            }
        }, {new: true})

        updatedUser.password = undefined;
        res.status(200).json(updatedUser);

    } catch (error) {
        next(errorHandler(401, error.message));
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        if(req.user.id != id){
            next(errorHandler(401, "You can only delete your own account!"))
        } 
        await User.findByIdAndDelete(id);
        res.clearCookie('access_token');
        res.status(200).json("User has been deleted!")
    } catch (error) {
        next(errorHandler(401, error.message));
    }
}

export const signOut = (req, res, next) => {
    try {
        res.clearCookie('access_token');
        res.status(200).json("User has been signed-out successfully!")
    } catch (error) {
        next(errorHandler(401, error.message));
    }
}

export const userListings = async (req, res, next) => {
    if(req.user.id === req.params.id){
        try {
            const listings = await Listing.find({ userRef : req.params.id });
            res.status(200).json(listings)
        } catch (error) {
            next(error);
        }
    } else {
        next(errorHandler(401, "You can only view your own listings"));
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user){
            next(errorHandler(401, "User not found"))
        }
        user.password = null;
        res.status(200).json(user);
    } catch (error) {
        next(errorHandler(401, error.message));
    }
}