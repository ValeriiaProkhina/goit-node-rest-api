import HttpError from "../helpers/HttpError.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import path from "node:path";
import fs from "node:fs/promises";
import Jimp from "jimp";

const avatarsDir = path.resolve("public", "avatars");
const { SECRET_KEY } = process.env;

export const register = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });
  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1d" });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

export const logout = async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).end();
};

export const current = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

export const updateSubscription = async (req, res) => {
  const { _id } = req.user;

  const updatedUser = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  });
  if (!updatedUser) {
    throw HttpError(404);
  }
  res.json({
    email: updatedUser.email,
    subscription: updatedUser.subscription,
  });
};

export const updateAvatar = async (req, res) => {
  if (!req.file) {
    throw HttpError(400, "Select a file for your avatar.");
  }
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;

  const avatar = await Jimp.read(tempUpload);
  avatar.resize(250, 250).write(tempUpload);

  const filename = `${_id}_${originalname}`;
  const resultUpload = path.resolve(avatarsDir, filename);

  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatars", filename);

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    { avatarURL },
    { new: true }
  );
  if (!updatedUser) {
    throw HttpError(404);
  }
  res.json({ avatarURL: updatedUser.avatarURL });
};
