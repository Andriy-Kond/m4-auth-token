import express from "express";
import { checkErrorJoiSchemaDecorator } from "../../middlewares/checkErrorJoiSchemaDecorator.js";
import { joiUserSchemas } from "../../models/userModel.js";
import { authController } from "../../controllers/authController.js";

export const authRouter = express.Router();

// * local middlewares "checkErrorJoiSchemaDecorator" checks by model for each request where you receive data:

// signup
// ??? authRouter.get("/register");
authRouter.post(
  "/register",
  checkErrorJoiSchemaDecorator(joiUserSchemas.registerUser), // check by User model
  authController.registration, // register new user
);

// login
authRouter.post("/login");
