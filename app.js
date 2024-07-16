const express = require("express");

const { getEndpoints } = require("./controllers/endpoints.controllers");

const { getTopics } = require("./controllers/topics.controllers");

const {
  getArticles,
  getArticleById,
  patchArticleById,
} = require("./controllers/articles.controllers");

const {
  getCommentsByArticleId,
  postCommentById,
  deleteCommentById,
} = require("./controllers/comments.controllers");

const { getUsers } = require("./controllers/users.controllers");

const {
  invalidAPIHandler,
  customErrorsHandler,
  databaseErrorsHandler,
  serverErrorsHandler,
} = require("./controllers/errors.controllers");

const app = express();

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentById);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.get("/api/users", getUsers);

app.all("*", invalidAPIHandler);

app.use(customErrorsHandler);
app.use(databaseErrorsHandler);
app.use(serverErrorsHandler);

module.exports = app;
