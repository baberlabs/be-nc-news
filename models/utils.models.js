const db = require("../db/connection");

// To refactor these utility functions later
// such that there will be only one utiltity function
// doesItExist(table, column, value)

exports.doesArticleExist = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows: articles }) => {
      if (!articles.length) {
        return Promise.reject({ status: 404, message: "Article Not Found" });
      }
      return articles[0].article_id;
    });
};

exports.doesCommentExist = (comment_id) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
    .then(({ rows: comments }) => {
      if (!comments.length) {
        return Promise.reject({ status: 404, message: "Comment Not Found" });
      }
      return comments[0].comment_id;
    });
};

exports.doesUserExist = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(({ rows: users }) => {
      if (!users.length) {
        return Promise.reject({ status: 404, message: "User Not Found" });
      }
      return users[0].username;
    });
};

exports.doesTopicExist = (slug) => {
  return db
    .query(`SELECT * FROM topics WHERE slug = $1`, [slug])
    .then(({ rows: topics }) => {
      if (!topics.length) {
        return Promise.reject({ status: 404, message: "Topic Not Found" });
      }
      return topics[0].slug;
    });
};

exports.countArticles = (topic) => {
  let queryString = `SELECT COUNT(article_id) :: INTEGER AS total_count FROM articles`;
  let queryValues = [];

  if (topic) {
    queryString += ` WHERE topic = $1`;
    queryValues.push(topic);
  }

  return db
    .query(queryString, queryValues)
    .then(({ rows }) => rows[0].total_count);
};

exports.countComments = (article_id) => {
  let queryString = `SELECT COUNT(comment_id) :: INTEGER AS total_count FROM comments`;
  let queryValues = [];

  if (article_id) {
    queryString += ` WHERE article_id = $1`;
    queryValues.push(article_id);
  }

  return db
    .query(queryString, queryValues)
    .then(({ rows }) => rows[0].total_count);
};
