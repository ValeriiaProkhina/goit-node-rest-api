import HttpError from "../helpers/HttpError.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import path from "node:path";
import fs from "node:fs/promises";
import Jimp from "jimp";
import sendMail from "../mail.js";
import crypto from "node:crypto";

const { SECRET_KEY, BASE_URL } = process.env;
const avatarsDir = path.resolve("public", "avatars");

export const register = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = crypto.randomUUID();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const verifyMail = {
    to: email,
    subject: "Welcome to Contacts App",
    html: `<p><strong>To confirm your email please click on the link - <a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Link to confirm</a></strong></p>`,
    text: `To confirm your email please open the link ${BASE_URL}/api/users/verify/${verificationToken}`,
  };
  await sendMail(verifyMail);

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

  if (!user.verify) {
    throw HttpError(401, "Please verify your email");
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

export const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }

  await User.findByIdAndUpdate(
    user._id,
    {
      verify: true,
      verificationToken: null,
    },
    { new: true }
  );

  res.json({
    message: "Verification successful",
  });
};

export const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(404);
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyMail = {
    to: email,
    subject: "Welcome to Contacts App",
    html: `<p><strong>To confirm your email please click on the link - <a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Link to confirm</a></strong></p>`,
    text: `To confirm your email please open the link ${BASE_URL}/api/users/verify/${user.verificationToken}`,
  };
  await sendMail(verifyMail);

  res.json({ message: "Verification email sent" });
};
