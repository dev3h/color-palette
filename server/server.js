import express, { json, urlencoded } from "express";
import cors from "cors";
require("dotenv").config();

// import "./connection_database";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(json());

app.use(urlencoded({ extended: true }));

app.use("/", (req, res) => {
  res.send("Hello World");
});

const PORT = process.env.PORT || 5000;

const listener = app.listen(PORT, () => {
  console.log(`Server is running on port ${listener.address().port}`);
});
