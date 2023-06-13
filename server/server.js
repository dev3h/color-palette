import express, { json, urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
require("dotenv").config();

import initRoutes from "./src/routes";
import dbConnect from "./src/config/dbconnect";

const app = express();

app.use(
  cors({
    origin: process.env.URL_SERVER,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(cookieParser());
app.use(json());
app.use(urlencoded({ extended: true }));

dbConnect();
initRoutes(app);

const PORT = process.env.PORT || 5000;

const listener = app.listen(PORT, () => {
  console.log(`Server is running on port ${listener.address().port}`);
});
