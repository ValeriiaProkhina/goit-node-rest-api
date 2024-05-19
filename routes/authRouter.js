import express from "express";
import validateBody from "../helpers/validateBody.js";
import {
  updateSubscriptionSchema,
  usersSchema,
} from "../schemas/usersSchema.js";
import {
  current,
  login,
  logout,
  register,
  updateAvatar,
  updateSubscription,
} from "../controllers/authControllers.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";

const authRouter = express.Router();
authRouter.post("/register", validateBody(usersSchema), ctrlWrapper(register));
authRouter.post("/login", validateBody(usersSchema), ctrlWrapper(login));
authRouter.post("/logout", authenticate, ctrlWrapper(logout));
authRouter.get("/current", authenticate, ctrlWrapper(current));
authRouter.patch(
  "/subscription",
  authenticate,
  validateBody(updateSubscriptionSchema),
  ctrlWrapper(updateSubscription)
);
authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  ctrlWrapper(updateAvatar)
);

export default authRouter;
