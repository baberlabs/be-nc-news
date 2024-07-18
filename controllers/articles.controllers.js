const {
  fetchArticles,
  fetchArticleByArticleId,
  updateArticleByArticleId,
} = require("../models/articles.models");

const { doesArticleExist } = require("../models/utils.models");

exports.getArticles = (request, response, next) => {
  const { sort_by, order, topic } = request.query;
  fetchArticles(sort_by, order, topic)
    .then((articles) => response.status(200).send({ articles }))
    .catch(next);
};

exports.getArticleByArticleId = (request, response, next) => {
  doesArticleExist(request.params.article_id)
    .then((article_id) => fetchArticleByArticleId(article_id))
    .then((article) => response.status(200).send({ article }))
    .catch(next);
};

exports.patchArticleByArticleId = (request, response, next) => {
  doesArticleExist(request.params.article_id)
    .then((article_id) =>
      updateArticleByArticleId(article_id, request.body.inc_votes),
    )
    .then((article) => response.status(200).send({ article }))
    .catch(next);
};
