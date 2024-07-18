const {
  fetchCommentsByArticleId,
  insertCommentByArticleId,
  removeCommentByArticleId,
  updateCommentByCommentId,
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

exports.postCommentByArticleId = (request, response, next) => {
  const { username, body } = request.body;
  doesArticleExist(request.params.article_id)
    .then((article_id) => insertCommentByArticleId(article_id, username, body))
    .then((comment) => response.status(201).send({ comment }))
    .catch(next);
};

exports.deleteCommentByArticleId = (request, response, next) => {
  doesCommentExist(request.params.comment_id)
    .then((comment_id) => removeCommentByArticleId(comment_id))
    .then(() => response.sendStatus(204))
    .catch(next);
};

exports.patchCommentByCommentId = (request, response, next) => {
  const { inc_votes } = request.body;
  doesCommentExist(request.params.comment_id)
    .then((comment_id) => updateCommentByCommentId(comment_id, inc_votes))
    .then((comment) => response.status(200).send({ comment }))
    .catch(next);
};
