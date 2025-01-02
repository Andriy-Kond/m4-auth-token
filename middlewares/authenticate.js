import jwt from "jsonwebtoken";
import "dotenv/config";
import { HttpError } from "../utils/HttpError.js";
import { User } from "../models/userModel.js";

const { SECRET_KEY } = process.env;

export const authenticate = (req, res, next) => {
  const { authorization = "" } = req.headers;
  // console.log("authenticate >> Authorization:::", authorization);

  const [bearer, token] = authorization.split(" ");
  // console.log("authenticate >> bearer:::", bearer);
  // console.log("authenticate >> token:::", token);

  if (bearer !== "Bearer") {
    next(HttpError({ status: 401, message: "Unauthorized" }));
  }

  try {
    const payload = jwt.verify(token, SECRET_KEY);
    // console.log("authenticate >> payload:::", payload);
    // // payload::: { id: '67765f1b21b8debb7ed21cb6', iat: 1735834786, exp: 1735917586 }

    const user = User.findById(payload.id);

    if (!user) next(HttpError({ status: 401, message: "User not found" }));

    req.user = user._conditions._id; // For adding identification of this user in contactController.js in method addContact()
    console.log(
      "authenticate >> user._conditions._id:::",
      user._conditions._id,
    );

    next();
  } catch (err) {
    // console.log("authenticate >> err:::", err);
    // authenticate >> err::: JsonWebTokenError: invalid signature
    next(HttpError({ status: 401 }));
  }
};
