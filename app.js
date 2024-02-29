const fs = require("node:fs/promises");
const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const moment = require("moment");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();

const swaggerDoc = require("./swagger.json");
const authRouter = require("./routes/api/auth");
const filtersRouter = require("./routes/api/filters");
const drinksRouter = require("./routes/api/drinks");
const usersRouter = require("./routes/api/users");

const app = express();
const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use(async (req, res, next) => {
  const { method, url } = req;
  const date = moment().format("DD-MM-YYYY_hh:mm:ss");
  await fs.appendFile("./public/server.log", `\n${method} ${url} ${date}`);
  next();
});

app.get("/ping", async (req, res) => {
  res.send({ message: `/ping: ${Date.now()}` });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use("/api/auth", authRouter);
app.use("/api/filters", filtersRouter);
app.use("/api/drinks", drinksRouter);
app.use("/api/users", usersRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;
