const express = require("express");
const app = express();
const endpointsJson = require("./endpoints.json");
const getTopics = require("./controllers/topics.controllers");
const {
  getArticleById,
  getArticles,
  getCommentByArticleId,
  postComment,
  updateArticle,
} = require("./controllers/articles.controllers");

app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints: endpointsJson });
});

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentByArticleId);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", updateArticle);

app.use((req, res) => {
  res.status(404).send({ message: "Endpoint not found" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ error: "Bad Request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.message === "article not found") {
    res.status(404).send({ err: "Not found" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ err: "Internal Server Error" });
});

module.exports = app;
