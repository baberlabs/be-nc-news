const db = require("../db/connection");

exports.fetchArticles = () => {
  const queryString = `
    SELECT
        articles.author,
        articles.title,
        articles.article_id,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        COALESCE(comment_count, 0) AS comment_count
    FROM articles
    LEFT JOIN (
        SELECT
            article_id,
            COUNT(comment_id) AS comment_count
        FROM comments
        GROUP BY article_id
    )
    USING (article_id)
    ORDER BY articles.created_at DESC
    `;
  return db.query(queryString).then(({ rows: articles }) =>
    articles.map((article) => ({
      ...article,
      comment_count: Number(article.comment_count),
    })),
  );
};

exports.fetchArticleById = (article_id) => {
  const queryString = `
    SELECT *
    FROM articles
    WHERE article_id = $1
    `;
  return db
    .query(queryString, [article_id])
    .then(({ rows: articles }) => articles[0]);
};

exports.updateArticleById = (article_id, inc_votes) => {
  const queryString = `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *
    `;
  return db
    .query(queryString, [inc_votes, article_id])
    .then(({ rows: articles }) => articles[0]);
};
