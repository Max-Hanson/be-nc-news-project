const {
  fetchArticleById,
  fetchArticles,
  fetchCommentbyArticleId,
  addComment,
  updateVotes,
} = require("../models/articles.models");

const getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
const getArticles = (req, res) => {
  fetchArticles().then((articles) => {
    res.status(200).send({ articles });
  });
};
const getCommentByArticleId = (req, res) => {
  const { article_id } = req.params;
  fetchCommentbyArticleId(article_id).then((comments) => {
    res.status(200).send({ comments });
  });
};
const postComment = (req, res) => {
  const { article_id } = req.params;
  const { author, body } = req.body;

  const newComment = { article_id, author, body };
  if (!author || !body) {
    return res.status(400).send({ message: "Bad Request" });
  } else {
    addComment(newComment).then(() => {
      res.status(201).send({ comment: newComment });
    });
  }
};
const updateArticle = (req, res) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  if (isNaN(inc_votes)) {
    return res.status(400).send({ message: "Bad Request" });
  }
  if (isNaN(article_id)) {
    return res.status(400).send({ message: "Invalid article id" });
  }
  updateVotes(article_id, inc_votes)
    .then((rows) => {
      if (rows.length === 0) {
        return res.status(404).send({ message: "Article not found" });
      } else {
        res.status(200).send(rows[0]);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: "internal server error" });
    });
};
const getSortedArticles = (req, res, next) => {
  const { sort_by, order } = req.query;
  sortArticles(sort_by, order).then(() => {
    return res.status(200).send({ articles });
  });
};

module.exports = {
  getArticleById,
  getArticles,
  getCommentByArticleId,
  postComment,
  updateArticle,
  getSortedArticles,
};
