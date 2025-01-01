import { User } from "../models/userModel.js";
import { HttpError } from "../utils/HttpError.js";
import { tryCatchDecorator } from "../utils/tryCatchDecorator.js";

const registration = async (req, res, next) => {
  //~ Adding custom error message for 409 status when you validate uniq field (email)
  const { email } = req.body;
  const user = await User.findOne({ email }); // Find user with this email. If not found, returns "null"
  if (user) {
    throw HttpError({
      status: 409,
      message: `Email ${email} already in our db`,
    });
  }
  //~ Adding custom error message for 409 status when you validate uniq field (email)

  const newUser = await User.create(req.body);
  res.status(201).json({
    email: newUser.email,
    name: newUser.name,
  });
};
const getToken = (req, res, next) => {};

export const authController = {
  registration: tryCatchDecorator(registration),
  getToken: tryCatchDecorator(getToken),
};
