import express from "express";
import validateBody from "../helpers/validateBody.js";
import {
  emailSchema,
  updateSubscriptionSchema,
  usersSchema,
} from "../schemas/usersSchema.js";
import {
  current,
  login,
  logout,
  register,
  resendVerifyEmail,
  updateAvatar,
  updateSubscription,
  verifyEmail,
} from "../controllers/authControllers.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";

const authRouter = express.Router();
authRouter.post("/register", validateBody(usersSchema), ctrlWrapper(register));
authRouter.get("/verify/:verificationToken", ctrlWrapper(verifyEmail));
authRouter.post(
  "/verify",
  validateBody(emailSchema),
  ctrlWrapper(resendVerifyEmail)
);
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
