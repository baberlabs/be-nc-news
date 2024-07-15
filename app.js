const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topics.controllers.js");
const { serverErrorsHandler } = require("./controllers/errors.controllers.js");

app.get("/api/topics", getTopics);

app.use(serverErrorsHandler);

module.exports = app;
