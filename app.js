const express = require("express");
const app = express();
const endpointsJson = require("./endpoints.json");
const getTopics = require("./controllers/topics.controllers");
const {
  getArticleById,
  getArticles,
} = require("./controllers/articles.controllers");

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints: endpointsJson });
});

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.use((req, res) => {
  res.status(404).send({ message: "Endpoint not found" });
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
