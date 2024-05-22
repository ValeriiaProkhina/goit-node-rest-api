import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import validateId from "../middlewares/validateId.js";
import {
  createContactSchema,
  updateContactSchema,
  updateStatusContactSchema,
} from "../schemas/contactsSchemas.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import authenticate from "../middlewares/authenticate.js";

const contactsRouter = express.Router();

contactsRouter.get("/", authenticate, ctrlWrapper(getAllContacts));

contactsRouter.get(
  "/:id",
  authenticate,
  validateId,
  ctrlWrapper(getOneContact)
);

contactsRouter.delete(
  "/:id",
  authenticate,
  validateId,
  ctrlWrapper(deleteContact)
);

contactsRouter.post(
  "/",
  authenticate,
  validateBody(createContactSchema),
  ctrlWrapper(createContact)
);

contactsRouter.put(
  "/:id",
  authenticate,
  validateBody(updateContactSchema),
  validateId,
  ctrlWrapper(updateContact)
);

contactsRouter.patch(
  "/:id/favorite",
  authenticate,
  validateBody(updateStatusContactSchema),
  validateId,
  ctrlWrapper(updateStatusContact)
);

export default contactsRouter;
