const {
  fetchArticleById,
  fetchArticles,
  fetchCommentbyArticleId,
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
module.exports = { getArticleById, getArticles, getCommentByArticleId };
