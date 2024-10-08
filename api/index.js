import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import listingRouter from "./routes/listing.route.js";
import cookieParser from "cookie-parser";
import path from "path"

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser())

mongoose.connect(process.env.MONGO).then(() => {
    console.log("Connected to DB!!");
}).catch((err) => {
    console.log("Error connecting to DB : ", err.message);
})


const __dirname = path.resolve();

app.listen(3000, () => {
    console.log("Listening on port 3000");
})

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/listing", listingRouter);

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
})

app.use((err, req, res, next) => {
    console.log(err)
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
})


