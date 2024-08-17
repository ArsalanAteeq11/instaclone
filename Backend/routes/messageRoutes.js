import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { getMessage, sendMessage } from "../controllers/messsageController.js";

const router = express.Router();

router.post("/send/:id", isAuth, sendMessage);
router.get("/get/:id", isAuth, getMessage);

export default router;
