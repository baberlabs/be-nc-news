const db = require("../db/connection");

// To refactor these utility functions later
// such that there will be only one utiltity function
// doesItExist(table, column, value)

exports.doesArticleExist = (article_id) => {
  return db
    .query(
      `
      SELECT *
      FROM articles
      WHERE article_id = $1
      `,
      [article_id],
    )
    .then(({ rows: articles }) => {
      if (!articles.length) {
        return Promise.reject({ status: 404, message: "Article Not Found" });
      }
      return articles[0].article_id;
    });
};

exports.doesCommentExist = (comment_id) => {
  return db
    .query(
      `
      SELECT *
      FROM comments
      WHERE comment_id = $1
      `,
      [comment_id],
    )
    .then(({ rows: comments }) => {
      if (!comments.length) {
        return Promise.reject({ status: 404, message: "Comment Not Found" });
      }
      return comments[0].comment_id;
    });
};
