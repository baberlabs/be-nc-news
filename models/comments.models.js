const db = require("../db/connection");

exports.fetchCommentsByArticleId = (article_id, limit = 10, page = 1) => {
  let queryString = `
    SELECT *
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC
    `;

  if (!/^\d+$/.test(limit) || !/^\d+$/.test(page)) {
    return Promise.reject({ status: 400, message: "Bad Request" });
  }

  queryString += `LIMIT ${limit} OFFSET ${(page - 1) * limit}`;

  return db
    .query(queryString, [article_id])
    .then(({ rows: comments }) => comments);
};

exports.insertCommentByArticleId = (article_id, author, body) => {
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
      [body, article_id, author],
    )
    .then(({ rows: comments }) => comments[0]);
};

exports.removeCommentByCommentId = (comment_id) => {
  return db.query(
    `
    DELETE FROM comments
    WHERE comment_id = $1
    `,
    [comment_id],
  );
};

exports.updateCommentByCommentId = (comment_id, inc_votes) => {
  return db
    .query(
      `
      UPDATE comments
      SET votes = votes + $1
      WHERE comment_id = $2
      RETURNING *
      `,
      [inc_votes, comment_id],
    )
    .then(({ rows: comments }) => comments[0]);
};

exports.removeCommentsByArticleId = (article_id) => {
  return db.query(
    `
    DELETE FROM comments
    WHERE article_id = $1
    `,
    [article_id],
  );
};
