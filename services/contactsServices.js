import Contact from "../models/contact.js";

export const getContacts = () => Contact.find();

export const getContact = (id) => Contact.findById(id);

export const removeContact = (id) => Contact.findByIdAndDelete(id);

export const createOneContact = (contactData) => Contact.create(contactData);

export const updatedContact = (id, update) =>
  Contact.findByIdAndUpdate(id, update, { new: true });
