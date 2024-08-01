import jwt from "jsonwebtoken"
import { errorHandler } from "./error.js";

export const verifyToken = async (req, res, next) => {
    try {
        const { access_token } = req.cookies
        if(!access_token){
            next(errorHandler(401, "Unauthorized!"));
        }
        const verifiedToken = jwt.verify(access_token, process.env.TOKEN_SECRET);
        if(!verifiedToken){
            next(errorHandler(401, "Forbidden!"))
        }
        req.user = verifiedToken;
        next();
    } catch (error) {
        next(errorHandler(401, error.message));
    }
}