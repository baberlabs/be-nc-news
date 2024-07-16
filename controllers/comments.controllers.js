const { fetchCommentsByArticleId } = require("../models/comments.models");

exports.getCommentsByArticleId = (request, response, next) => {
  fetchCommentsByArticleId(request.params.article_id)
    .then((comments) => response.status(200).send({ comments }))
    .catch(next);
};
