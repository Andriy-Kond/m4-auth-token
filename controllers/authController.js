import { User } from "../models/userModel.js";
import { HttpError } from "../utils/HttpError.js";
import { tryCatchDecorator } from "../utils/tryCatchDecorator.js";
import bcrypt from "bcrypt";

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

  // send token
  const token = "klajsdflkjsalkdfj.asldkfjlsakfdj.sjalkdfjsalkdf";
  res.json({ token });
};

export const authController = {
  register: tryCatchDecorator(register),
  login: tryCatchDecorator(login),
};
