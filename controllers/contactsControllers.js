import HttpError from "../helpers/HttpError.js";
import {
  getContact,
  getContacts,
  removeContact,
  updatedContact,
  createOneContact,
} from "../services/contactsServices.js";

export const getAllContacts = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10, favorite } = req.query;
  const skip = (page - 1) * limit;
  try {
    const contacts = await getContacts({ owner }, "", { skip, limit });
    if (favorite === "true") {
      const favoriteContacts = contacts.filter((contact) => contact.favorite);
      res.json(favoriteContacts);
    }
    res.json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { id } = req.params;
  try {
    const contact = await getContact({ _id: id, owner });
    if (!contact) {
      throw HttpError(404);
    }
    res.json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { id } = req.params;
  try {
    const contact = await getContact({ _id: id, owner });
    if (!contact) {
      throw HttpError(404);
    }
    const deletedContact = await removeContact(id);
    if (!deletedContact) {
      throw HttpError(404);
    }
    res.json(deletedContact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  const { _id: owner } = req.user;
  try {
    const createdContact = await createOneContact({
      ...req.body,
      owner,
    });
    res.status(201).json(createdContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return res
      .status(400)
      .json({ message: "Body must have at least one field" });
  }
  const { _id: owner } = req.user;
  const { id } = req.params;
  try {
    const contact = await getContact({ _id: id, owner });
    if (!contact) {
      throw HttpError(404);
    }
    const updated = await updatedContact(id, req.body);
    if (!updated) {
      throw HttpError(404);
    }
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { id } = req.params;
  try {
    const contact = await getContact({ _id: id, owner });
    if (!contact) {
      throw HttpError(404);
    }
    const updatedStatus = await updatedContact(id, req.body);
    if (!updatedStatus) {
      throw HttpError(404);
    }
    res.json(updatedStatus);
  } catch (error) {
    next(error);
  }
};
