import * as fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const contactsPath = path.resolve("db", "contacts.json");

async function readContacts() {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
}
function writeContacts(contacts) {
  return fs.writeFile(contactsPath, JSON.stringify(contacts, undefined, 2));
}
async function listContacts() {
  const contacts = await readContacts();
  return contacts;
}

async function getContactById(contactId) {
  const contacts = await readContacts();
  const contact = contacts.find((contact) => contact.id === contactId);
  if (typeof contact === "undefined") {
    return null;
  }
  return contact;
}

async function removeContact(contactId) {
  const contacts = await readContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null;
  }
  const removedContact = contacts[index];
  const updatedContacts = [
    ...contacts.slice(0, index),
    ...contacts.slice(index + 1),
  ];
  await writeContacts(updatedContacts);
  return removedContact;
}

async function addContact(name, email, phone) {
  const contacts = await readContacts();
  const newContact = { id: crypto.randomUUID(), name, email, phone };
  contacts.push(newContact);
  await writeContacts(contacts);
  return newContact;
}

async function updatedContact(contactId, contact) {
  const contacts = await readContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null;
  }
  const updated = {
    ...contacts[index],
    ...contact,
  };
  contacts[index] = updated;
  await writeContacts(contacts);
  return updated;
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updatedContact,
};
