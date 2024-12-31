// authModel or userModel

import { Schema, model } from "mongoose";
import validator from "validator";
import Joi from "joi";
import { handleMongooseError } from "../utils/handleMongooseError";

const { isLength } = validator;

const emailRegExp = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})*$/;

// /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
const emailValidator = {
  validator: value => {
    return emailRegExp.test(value);
  },
  message:
    "Invalid email format. Ensure at least one domain after @ and at least 2 characters after the last dot.",
};

const passwordValidator = {
  validator: value => isLength(value, { min: 10, max: 15 }),
  message: "Password must be 10-15 characters long",
};

//^ Mongoose-schema - validate data before for save it in db
const mongooseUserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [30, "Name must be not exceed 30 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      // You can use "match" for simple validation:
      match: [emailRegExp, "Invalid email format"],
      // or "validate" if more complex expression needed:
      // validate: emailValidator,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      validate: passwordValidator,
    },
  },
  { versionKey: false, timestamps: true },
);

// ! Middleware for errors of mongoose schema:
mongooseUserSchema.post("save", handleMongooseError);
// email must be uniq item in db. Cannot be two users with the same email. So needs additional validation.

export const User = model("user", mongooseUserSchema);

//^ Joi-schemas - validates data coming from the frontend
const registerUser = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().pattern(emailRegExp).required(),
  password: Joi.string().required(),
});

const loginUser = Joi.object({
  email: Joi.string().pattern(emailRegExp).required(),
  password: Joi.string().required(),
});

export const joiUserSchemas = {
  registerUser,
  loginUser,
};
