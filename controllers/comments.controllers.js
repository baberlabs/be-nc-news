const {
  fetchCommentsByArticleId,
  insertCommentById,
  removeCommentById,
} = require("../models/comments.models");

const {
  doesArticleExist,
  doesCommentExist,
} = require("../models/utils.models");

exports.getCommentsByArticleId = (request, response, next) => {
  doesArticleExist(request.params.article_id)
    .then((article_id) => fetchCommentsByArticleId(article_id))
    .then((comments) => response.status(200).send({ comments }))
    .catch(next);
};

exports.postCommentById = (request, response, next) => {
  const { username, body } = request.body;
  doesArticleExist(request.params.article_id)
    .then((article_id) => insertCommentById(article_id, username, body))
    .then((comment) => response.status(201).send({ comment }))
    .catch(next);
};

exports.deleteCommentById = (request, response, next) => {
  doesCommentExist(request.params.comment_id)
    .then((comment_id) => removeCommentById(comment_id))
    .then(() => response.sendStatus(204))
    .catch(next);
};
