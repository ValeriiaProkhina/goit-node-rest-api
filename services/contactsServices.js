import Contact from "../models/contact.js";

export const getContacts = (owner, skip, limit) =>
  Contact.find(owner, skip, limit);

export const getContact = (id, owner) => Contact.findOne(id, owner);

export const removeContact = (id) => Contact.findByIdAndDelete(id);

export const createOneContact = (contactData) => Contact.create(contactData);

export const updatedContact = (id, update) =>
  Contact.findByIdAndUpdate(id, update, { new: true });
