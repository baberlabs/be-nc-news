const db = require("../db/connection");
const { doesArticleExist } = require("../utils");

exports.fetchCommentsByArticleId = (article_id) => {
  return doesArticleExist(article_id)
    .then((result) => {
      if (!result) {
        return Promise.reject({ status: 404, message: "Article Not Found" });
      }
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

exports.insertComment = (article_id, { username, body }) => {
  // console.log(article_id, author, body);
  return doesArticleExist(article_id).then((result) => {
    if (!result) {
      return Promise.reject({ status: 404, message: "Article Not Found" });
    }
    return db
      .query(
        `
      INSERT INTO comments (
        body,
        article_id,
        author
      )
      VALUES
      ($1, $2, $3)
      RETURNING *
      `,
        [body, article_id, username],
      )
      .then(({ rows: comments }) => comments[0]);
  });
};
