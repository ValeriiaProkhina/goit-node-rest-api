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
  updateSubscription,
} from "../controllers/authControllers.js";
import authenticate from "../middlewares/authenticate.js";

const authRouter = express.Router();
authRouter.post("/register", validateBody(usersSchema), register);
authRouter.post("/login", validateBody(usersSchema), login);
authRouter.post("/logout", authenticate, logout);
authRouter.get("/current", authenticate, current);
authRouter.patch(
  "/subscription",
  authenticate,
  validateBody(updateSubscriptionSchema),
  updateSubscription
);

export default authRouter;
