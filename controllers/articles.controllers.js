const {
  fetchArticles,
  fetchArticleById,
} = require("../models/articles.models");

exports.getArticles = (request, response, next) => {
  fetchArticles()
    .then((articles) => response.status(200).send({ articles }))
    .catch(next);
};

exports.getArticleById = (request, response, next) => {
  fetchArticleById(request.params.article_id)
    .then((article) => response.status(200).send({ article }))
    .catch(next);
};
