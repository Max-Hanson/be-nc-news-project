const db = require("../db/connection");

const fetchArticleById = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ message: "article not found" });
      } else {
        return rows[0];
      }
    });
};
const fetchArticles = () => {
  return db
    .query(
      `SELECT 
      articles.author, 
      articles.title, 
      articles.article_id, 
      articles.topic, 
      articles.created_at, 
      articles.votes, 
      articles.article_img_url,
      COUNT(comments.comment_id) AS comment_count 
    FROM articles
     LEFT JOIN comments ON articles.article_id = comments.article_id
     GROUP BY 
     articles.author,
     articles.title, 
     articles.article_id, 
     articles.topic, 
     articles.created_at, 
     articles.votes, 
     articles.article_img_url
    ORDER BY articles.created_at DESC;
    `
    )
    .then((res) => {
      return res.rows;
    });
};
const fetchCommentbyArticleId = (id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
      [id]
    )
    .then(({ rows }) => {
      return rows;
    });
};
module.exports = { fetchArticleById, fetchArticles, fetchCommentbyArticleId };
