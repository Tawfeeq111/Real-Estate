import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js"

dotenv.config();
const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO).then(() => {
    console.log("Connectrd to DB!!");
}).catch((err) => {
    console.log("Error connecting to DB : ", err.message);
})

app.listen(3000, () => {
    console.log("Listening on port 3000");
})

app.use("/api/auth", authRouter);

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