const {
  fetchArticles,
  fetchArticleByArticleId,
  updateArticleByArticleId,
  insertArticle,
} = require("../models/articles.models");

const {
  doesArticleExist,
  doesUserExist,
  doesTopicExist,
} = require("../models/utils.models");

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
  const { inc_votes } = request.body;
  doesArticleExist(request.params.article_id)
    .then((article_id) => updateArticleByArticleId(article_id, inc_votes))
    .then((article) => response.status(200).send({ article }))
    .catch(next);
};

exports.postArticle = (request, response, next) => {
  const { username, title, body, topic, article_img_url } = request.body;
  doesUserExist(username)
    .then(() => doesTopicExist(topic))
    .then(() => insertArticle(username, title, body, topic, article_img_url))
    .then((article) => response.status(201).send({ article }))
    .catch(next);
};
