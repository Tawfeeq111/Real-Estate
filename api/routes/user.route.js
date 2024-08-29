import express from "express";
import { deleteUser, signOut, updateUser, userListings, getUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/signout", signOut);
router.get("/listings/:id", verifyToken, userListings);
router.get("/getUser/:id", verifyToken, getUser);

export default router;