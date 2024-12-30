// authModel or userModel

import { Schema, model } from "mongoose";
import validate from "mongoose-validator";
import Joi from "joi";
import { handleMongooseError } from "../utils/handleMongooseError";

const emailRegExp = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})*$/;

const emailValidator = validate({
  validator: function (value) {
    const regex = emailRegExp;
    return regex.test(value);
  },
  message:
    "Invalid email format. Ensure at least one domain after @ and at least 2 characters after the last dot.",
});

const mongooseUserSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    validate: emailValidator,
  },
  password: {
    type: String,
    required: true,
    validate: validate({
      validator: value => isLength(value, { min: 10, max: 15 }),
      message: "Password must be 10-15 characters long",
    }),
  },
});

mongooseUserSchema.post("save", handleMongooseError);

export const User = model("user", mongooseUserSchema);

//^ Joi-schema - validates data coming from the frontend
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
