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
  return db
    .query(queryString)
    .then(({ rows: articles }) =>
      articles.map((article) => {
        return {
          ...article,
          comment_count: Number(article.comment_count),
        };
      })
    )
    .catch((error) => {
      console.log(error);
    });
};

exports.fetchArticleById = (article_id) => {
  const queryString = `
    SELECT *
    FROM articles
    WHERE article_id = $1
    `;
  return db.query(queryString, [article_id]).then(({ rows: articles }) => {
    if (!articles.length) {
      return Promise.reject({ status: 404, message: "Not Found" });
    }
    return articles[0];
  });
};
