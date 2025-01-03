import jwt from "jsonwebtoken";
import "dotenv/config";
import { HttpError } from "../utils/HttpError.js";
import { User } from "../models/userModel.js";

const { SECRET_KEY } = process.env;

export const authenticate = async (req, res, next) => {
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

    const user = await User.findById(payload.id);

    if (!user) next(HttpError({ status: 401, message: "User not found" }));

    // Object "req" is one for one request. For example for request contactsRouter.post("/", authenticate, checkErrorJoiSchemaDecorator(joiContactSchemas.addContact), contactsController.addContact) it will be ths same in authenticate, checkErrorJoiSchemaDecorator and contactsController.
    req.user = user; // For adding identification of this user in contactController.addContact() or other places

    next();
  } catch (err) {
    // console.log("authenticate >> err:::", err);
    // authenticate >> err::: JsonWebTokenError: invalid signature
    next(HttpError({ status: 401 }));
  }
};
