import { tryCatchDecorator } from "../utils/tryCatchDecorator.js";

const getToken = () => {};

export const authController = { getToken: tryCatchDecorator(getToken) };
