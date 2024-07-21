const {
  fetchArticles,
  fetchArticleByArticleId,
  updateArticleByArticleId,
  insertArticle,
  removeArticleByArticleId,
} = require("../models/articles.models");

const { removeCommentsByArticleId } = require("../models/comments.models");

const {
  doesArticleExist,
  doesUserExist,
  doesTopicExist,
  countArticles,
  doesCommentExist,
} = require("../models/utils.models");

exports.getArticles = (request, response, next) => {
  const { sort_by, order, topic, limit, page } = request.query;
  Promise.resolve()
    .then(() => {
      if (topic) return doesTopicExist(topic);
    })
    .then(() => fetchArticles(sort_by, order, topic, limit, page))
    .then((articles) => Promise.all([articles, countArticles(topic)]))
    .then(([articles, total_count]) => {
      response.status(200).send({ articles, total_count });
    })
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

exports.deleteArticleByArticleId = (request, response, next) => {
  const { article_id } = request.params;
  doesArticleExist(article_id)
    .then(() => removeCommentsByArticleId(article_id))
    .then(() => removeArticleByArticleId(article_id))
    .then(() => response.sendStatus(204))
    .catch(next);
};
