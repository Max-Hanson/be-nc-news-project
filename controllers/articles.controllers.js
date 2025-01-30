const {
  fetchArticleById,
  fetchArticles,
  fetchCommentbyArticleId,
  addComment,
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
module.exports = {
  getArticleById,
  getArticles,
  getCommentByArticleId,
  postComment,
};
