const db = require("../db/connection");
const { doesArticleExist } = require("../utils");

exports.fetchCommentsByArticleId = (article_id) => {
  return doesArticleExist(article_id)
    .then((result) => {
      if (!result) {
        return Promise.reject({ status: 404, message: "Article Not Found" });
      }
    })
    .then(() => {
      return db.query(
        `
      SELECT *
      FROM comments
      WHERE article_id = $1
      ORDER BY created_at DESC
      `,
        [article_id],
      );
    })
    .then(({ rows: comments }) => comments);
};
