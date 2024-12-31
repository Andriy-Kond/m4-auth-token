import express from "express";
import { authController } from "../../controllers/authController.js";

export const authRouter = express.Router();

// signup
authRouter.post("/register", authController.getToken);
// ??? authRouter.get("/register");

// login
authRouter.post("/login");
