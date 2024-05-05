import { connect } from "mongoose";

export default async function connectDB() {
  try {
    await connect(process.env.DB_URI);
    console.log("Database connection is success!");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
}
