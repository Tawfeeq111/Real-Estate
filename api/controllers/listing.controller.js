import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js"


export const createListing = async (req, res, next) => {
    try {
    const listing = await Listing.create(req.body);
    res.status(201).json(listing);
    } catch (error) {
        next(errorHandler(401, error.message));
    }
}

export const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if(!listing){
        return next(errorHandler(401, "Listing not found"));
    }

    if(req.user.id !== listing.userRef){
        return next(errorHandler(401, "You can only delete your own listings"));
    }

    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json({"message":"Listing deleted successfully"});
    } catch (error) {
        next(errorHandler(401, error.message));
    }
}

export const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);

    if(!listing){
        return next(errorHandler(401, "Listing not found"));
    }

    if(listing.userRef !== req.user.id){
        return next(errorHandler(401, "You can only update your own listings"));
    }

    try {
        const newListing = await Listing.findByIdAndUpdate(
            req.params.id, 
            req.body,
            {new: true}
        )
        res.status(200).json(newListing);
    } catch (error) {
        next(errorHandler(401, error.message));
    }
}

export const getListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if(!listing){
            return next(errorHandler(401, "Listing not found"));
        }
        res.status(200).json(listing);
    } catch (error) {
        next(errorHandler(401, error.message));
    }
}