const {
  invalidAPIHandler,
  customErrorsHandler,
  databaseErrorsHandler,
  serverErrorsHandler,
} = require("./controllers/errors.controllers");

const express = require("express");
const cors = require("cors");

const apiRouter = require("./routes/api-router");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

app.all("*", invalidAPIHandler);

app.use(customErrorsHandler);
app.use(databaseErrorsHandler);
app.use(serverErrorsHandler);

module.exports = app;
