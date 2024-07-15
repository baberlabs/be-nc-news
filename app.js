const express = require("express");
const app = express();

const { getEndpoints } = require("./controllers/endpoints.controllers");
const { getTopics } = require("./controllers/topics.controllers");
const { getArticleById } = require("./controllers/articles.controllers");

const {
  invalidAPIHandler,
  customErrorsHandler,
  databaseErrorsHandler,
  serverErrorsHandler,
} = require("./controllers/errors.controllers");

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.all("*", invalidAPIHandler);

app.use(customErrorsHandler);
app.use(databaseErrorsHandler);
app.use(serverErrorsHandler);

module.exports = app;
