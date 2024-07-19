const {
  fetchCommentsByArticleId,
  insertCommentByArticleId,
  removeCommentByArticleId,
  updateCommentByCommentId,
} = require("../models/comments.models");

const {
  doesArticleExist,
  doesCommentExist,
  countComments,
} = require("../models/utils.models");

exports.getCommentsByArticleId = async (request, response, next) => {
  const { article_id } = request.params;
  const { limit, page } = request.query;
  doesArticleExist(article_id)
    .then(() => fetchCommentsByArticleId(article_id, limit, page))
    .then((comments) => Promise.all([comments, countComments(article_id)]))
    .then(([comments, total_count]) => {
      response.status(200).send({ comments, total_count });
    })
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
