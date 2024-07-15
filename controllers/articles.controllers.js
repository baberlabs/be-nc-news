const { fetchArticleById } = require("../models/articles.models");

exports.getArticleById = (request, response, next) => {
  fetchArticleById(request.params.article_id)
    .then((article) => response.status(200).send({ article }))
    .catch(next);
};
