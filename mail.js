import sgMail from "@sendgrid/mail";
import "dotenv/config";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = (data) => {
  const email = { ...data, from: "applehouse1883@icloud.com" };
  return sgMail.send(email);
};
export default sendMail;
