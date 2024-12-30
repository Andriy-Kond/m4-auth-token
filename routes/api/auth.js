import express from "express";

export const authRouter = express.Router();

// signup
authRouter.post("/register");

// login
authRouter.post("/login");
