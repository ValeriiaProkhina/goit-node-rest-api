import connectDB from "./db/connect.js";
import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";

import contactsRouter from "./routes/contactsRouter.js";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

const port = process.env.PORT || 8000;
connectDB()
  .then(() =>
    app.listen(port, () => {
      console.log(`Server is running. Use our API on port: ${port}`);
    })
  )
  .catch((err) =>
    console.log(`Server not running. Error message: ${err.message}`)
  );
