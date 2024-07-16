const express = require("express");

const { getEndpoints } = require("./controllers/endpoints.controllers");

const { getTopics } = require("./controllers/topics.controllers");

const {
  getArticles,
  getArticleById,
} = require("./controllers/articles.controllers");

const {
  getCommentsByArticleId,
} = require("./controllers/comments.controllers");

const {
  invalidAPIHandler,
  customErrorsHandler,
  databaseErrorsHandler,
  serverErrorsHandler,
} = require("./controllers/errors.controllers");

const app = express();

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.all("*", invalidAPIHandler);

app.use(customErrorsHandler);
app.use(databaseErrorsHandler);
app.use(serverErrorsHandler);

module.exports = app;
