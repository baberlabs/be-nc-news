const {
  fetchArticles,
  fetchArticleById,
  updateArticleById,
} = require("../models/articles.models");

const { doesArticleExist } = require("../models/utils.models");

exports.getArticles = (request, response, next) => {
  fetchArticles()
    .then((articles) => response.status(200).send({ articles }))
    .catch(next);
};

exports.getArticleById = (request, response, next) => {
  doesArticleExist(request.params.article_id)
    .then((article_id) => fetchArticleById(article_id))
    .then((article) => response.status(200).send({ article }))
    .catch(next);
};

exports.patchArticleById = (request, response, next) => {
  doesArticleExist(request.params.article_id)
    .then((article_id) => updateArticleById(article_id, request.body.inc_votes))
    .then((article) => response.status(200).send({ article }))
    .catch(next);
};
