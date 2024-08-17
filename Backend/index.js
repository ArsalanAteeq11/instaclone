import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectdb from "./utils/database.js";
import userRoute from "./routes/userRoute.js";
import postRoute from "./routes/postRoutes.js";
import messageRoute from "./routes/messageRoutes.js";
import { app, server } from "./socket/socket.js";
import path from "path";

dotenv.config({});

const PORT = process.env.PORT;

const __dirname = path.resolve();
console.log(__dirname);

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  urlencoded({
    extended: true,
  })
);
const corsOption = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOption));

app.use("/user", userRoute);
app.use("/post", postRoute);
app.use("/message", messageRoute);

app.use(express.static(path.join(__dirname, "/Frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "Frontend", "dist", "index.html"));
});

server.listen(PORT, () => {
  connectdb();
  console.log(`server is listening at port ${PORT}`);
});
