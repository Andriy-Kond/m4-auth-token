import { User } from "../models/userModel.js";
import { HttpError } from "../utils/HttpError.js";
import { tryCatchDecorator } from "../utils/tryCatchDecorator.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config"; // must be imported in each place where you get any keys from process.env

const { SECRET_KEY = "" } = process.env;

const register = async (req, res, next) => {
  //~ Adding custom error message for 409 status when you validate uniq field (for example "email")
  const { email, password } = req.body;

  const user = await User.findOne({ email }); // Find user with this email. If not found, returns "null"
  if (user) {
    throw HttpError({
      status: 409,
      message: `Email ${email} already in our db`,
    });
  }
  //~ Adding custom error message for 409 status when you validate uniq field (for example "email")

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...req.body, password: hashedPassword });

  res.status(201).json({
    email: newUser.email,
    name: newUser.name,
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError({
      status: 401,
      message: `Email or password invalid`,
    });
  }

  const comparePass = await bcrypt.compare(password, user.password);
  if (!comparePass) {
    throw HttpError({
      status: 401,
      message: `Email or password invalid`,
    });
  }

  // Create and send token
  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  // console.log("login >> token:::", token);
  await User.findByIdAndUpdate(user._id, { token });

  res.json({ token });
};

// Check whether token is still valid and send name&email
const getCurrentUser = (req, res, next) => {
  const { email, name } = req.user;
  res.json({ email, name });
};

// Check whether token is still valid and send name&email
const logout = async (req, res, next) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.json({ message: "Logout success" });
};

export const authController = {
  register: tryCatchDecorator(register),
  login: tryCatchDecorator(login),
  getCurrentUser: tryCatchDecorator(getCurrentUser), // can be without tryCatchDecorator
  logout: tryCatchDecorator(logout),
};
