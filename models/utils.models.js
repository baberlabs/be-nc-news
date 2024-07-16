const db = require("../db/connection");

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
