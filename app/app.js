const express = require("express");
const {
    getEndpoints,
    getTopics,
    getArticleById,
    getArticles,
    getCommentsByArticle,
    postCommentToArticle,
    patchArticleById,
    deleteCommentById,
    getUsers,
} = require("./controller");

const app = express();
app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.patch("/api/articles/:article_id", patchArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticle);

app.post("/api/articles/:article_id/comments", postCommentToArticle);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.get("/api/users", getUsers);

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
