const {
  fetchCommentsByArticleId,
  insertComment,
} = require("../models/comments.models");

const { doesArticleExist } = require("../models/utils.models");

exports.getCommentsByArticleId = (request, response, next) => {
  doesArticleExist(request.params.article_id)
    .then((article_id) => fetchCommentsByArticleId(article_id))
    .then((comments) => response.status(200).send({ comments }))
    .catch(next);
};

exports.postComment = (request, response, next) => {
  const { username, body } = request.body;
  doesArticleExist(request.params.article_id)
    .then((article_id) => insertComment(article_id, username, body))
    .then((comment) => response.status(201).send({ comment }))
    .catch(next);
};
