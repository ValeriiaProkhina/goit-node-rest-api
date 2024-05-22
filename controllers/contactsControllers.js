import HttpError from "../helpers/HttpError.js";
import {
  getContact,
  getContacts,
  removeContact,
  updatedContact,
  createOneContact,
} from "../services/contactsServices.js";

export const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10, favorite } = req.query;
  const skip = (page - 1) * limit;

  const contacts = await getContacts({ owner }, "", { skip, limit });
  if (favorite === "true") {
    const favoriteContacts = contacts.filter((contact) => contact.favorite);
    res.json(favoriteContacts);
  }
  res.json(contacts);
};

export const getOneContact = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;

  const contact = await getContact({ _id: id, owner });
  if (!contact) {
    throw HttpError(404);
  }
  res.json(contact);
};

export const deleteContact = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;

  const contact = await getContact({ _id: id, owner });
  if (!contact) {
    throw HttpError(404);
  }
  const deletedContact = await removeContact(id);
  if (!deletedContact) {
    throw HttpError(404);
  }
  res.json(deletedContact);
};

export const createContact = async (req, res) => {
  const { _id: owner } = req.user;

  const createdContact = await createOneContact({
    ...req.body,
    owner,
  });
  res.status(201).json(createdContact);
};

export const updateContact = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res
      .status(400)
      .json({ message: "Body must have at least one field" });
  }
  const { _id: owner } = req.user;
  const { id } = req.params;

  const contact = await getContact({ _id: id, owner });
  if (!contact) {
    throw HttpError(404);
  }
  const updated = await updatedContact(id, req.body);
  if (!updated) {
    throw HttpError(404);
  }
  res.json(updated);
};

export const updateStatusContact = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;

  const contact = await getContact({ _id: id, owner });
  if (!contact) {
    throw HttpError(404);
  }
  const updatedStatus = await updatedContact(id, req.body);
  if (!updatedStatus) {
    throw HttpError(404);
  }
  res.json(updatedStatus);
};
