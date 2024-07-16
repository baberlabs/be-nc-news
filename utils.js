const db = require("./db/connection");

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
    .then(({ rows: articles }) => articles.length > 0);
};
