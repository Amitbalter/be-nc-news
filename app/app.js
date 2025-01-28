const express = require("express");
const { getEndpoints, getTopics, getArticleById, getArticles } = require("./controller");
const app = express();

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else next(err);
});

app.use((err, req, res, next) => {
    if (err.code === "22P02") {
        res.status(400).send({ msg: "Bad request" });
    } else next(err);
});

module.exports = app;
