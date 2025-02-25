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
const addComment = (newComment) => {
  const { article_id, author, body } = newComment;

  return db
    .query(
      `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *`,
      [article_id, author, body]
    )

    .then(({ rows }) => {
      return rows;
    });
};
const updateVotes = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles
     SET votes = votes + $1
     WHERE article_id = $2
     RETURNING *`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};
const sortArticles = (sort_by, order) => {
  return db
    .query(
      `SELECT * FROM articles
    ORDER BY ${sort_by} ${order};
  `
    )
    .then(({ rows }) => rows);
};
module.exports = {
  fetchArticleById,
  fetchArticles,
  fetchCommentbyArticleId,
  addComment,
  updateVotes,
  sortArticles,
};
