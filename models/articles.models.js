const db = require("../db/connection");

exports.fetchArticles = (sort_by = "created_at", order = "desc", topic) => {
  const whitelistSortBy = [
    "article_id",
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];

  const whitelistOrder = ["asc", "desc"];

  if (!whitelistSortBy.includes(sort_by) || !whitelistOrder.includes(order)) {
    return Promise.reject({
      status: 400,
      message: "Bad Request: Invalid Query",
    });
  }

  let queryString = `
    SELECT
        articles.article_id,
        articles.title,
        articles.topic,
        articles.author,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        COALESCE (comment_count, 0) :: INTEGER AS comment_count
    FROM articles
    LEFT JOIN (
        SELECT
            article_id,
            COUNT (comment_id) AS comment_count
        FROM comments
        GROUP BY article_id
    ) AS comment_counts
    USING (article_id)
    `;

  const queryValues = [];

  if (topic) {
    queryString += ` WHERE topic = $1`;
    queryValues.push(topic);
  }

  if (whitelistSortBy.includes(sort_by)) {
    queryString += ` ORDER BY ${sort_by}`;
  }

  if (whitelistOrder.includes(order)) {
    queryString += `  ${order}`;
  }

  return db
    .query(queryString, queryValues)
    .then(({ rows: articles }) => articles);
};

exports.fetchArticleById = (article_id) => {
  const queryString = `
    SELECT
        articles.article_id,
        articles.title,
        articles.topic,
        articles.author,
        articles.body,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        COALESCE (comment_count, 0) :: INTEGER AS comment_count
    FROM articles
    LEFT JOIN (
        SELECT
            article_id,
            COUNT (comment_id) AS comment_count
        FROM comments
        GROUP BY article_id
    ) AS comment_counts
    USING (article_id)
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
