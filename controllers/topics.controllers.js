const { fetchTopics, insertTopic } = require("../models/topics.models.js");

exports.getTopics = (request, response, next) => {
  fetchTopics()
    .then((topics) => response.status(200).send({ topics }))
    .catch(next);
};

exports.postTopic = (request, response, next) => {
  const { slug, description } = request.body;
  insertTopic(slug, description)
    .then((topic) => response.status(201).send({ topic }))
    .catch(next);
};
