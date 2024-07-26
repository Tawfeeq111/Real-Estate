import express from "express";
import { connect } from "http2";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const app = express();

mongoose.connect(process.env.MONGO).then(() => {
    console.log("Connectrd to DB!!");
}).catch((err) => {
    console.log("Error connecting to DB : ", err.message);
})

app.listen(3000, () => {
    console.log("Listening on port 3000");
})