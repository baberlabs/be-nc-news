const {
  fetchCommentsByArticleId,
  insertComment,
} = require("../models/comments.models");

exports.getCommentsByArticleId = (request, response, next) => {
  fetchCommentsByArticleId(request.params.article_id)
    .then((comments) => response.status(200).send({ comments }))
    .catch(next);
};

exports.postComment = (request, response, next) => {
  insertComment(request.params.article_id, request.body)
    .then((comment) => response.status(201).send({ comment }))
    .catch(next);
};
