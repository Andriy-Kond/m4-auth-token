import express from "express";
import { checkErrorJoiSchemaDecorator } from "../../middlewares/checkErrorJoiSchemaDecorator.js";
import { joiUserSchemas } from "../../models/userModel.js";
import { authController } from "../../controllers/authController.js";
import { authenticate } from "../../middlewares/authenticate.js";

export const authRouter = express.Router();

// * local middlewares "checkErrorJoiSchemaDecorator" checks by model for each request where you receive data:

// signup
authRouter.post(
  "/register",
  checkErrorJoiSchemaDecorator(joiUserSchemas.registerUser), // check by User model
  authController.register, // register new user
);

// login
authRouter.post(
  "/login",
  checkErrorJoiSchemaDecorator(joiUserSchemas.loginUser), // check by User model
  authController.login, // register new user
);

// take token from .../current
authRouter.get(
  "/current",
  authenticate, // checks whether token is correct
  authController.getCurrentUser, // check whether token is still valid
);
