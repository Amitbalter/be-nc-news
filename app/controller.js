const {
    fetchEndpoints,
    selectTopics,
    selectArticleById,
    selectArticles,
    selectCommentsByArticle,
    insertCommentToArticle,
    updateArticleById,
    removeCommentById,
    selectCommentById,
} = require("./model");

exports.getEndpoints = (req, res) => {
    const endpoints = fetchEndpoints();
    res.status(200).send(endpoints);
};

exports.getTopics = (req, res, next) => {
    selectTopics().then((result) => {
        res.status(200).send(result);
    });
};

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleById(article_id)
        .then((article) => {
            res.status(200).send(article);
        })
        .catch(next);
};

exports.getArticles = (req, res, next) => {
    selectArticles()
        .then((articles) => {
            res.status(200).send(articles);
        })
        .catch(next);
};

exports.getCommentsByArticle = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleById(article_id)
        .then(() => {
            selectCommentsByArticle(article_id).then((comments) => {
                res.status(200).send(comments);
            });
        })
        .catch(next);
};

exports.postCommentToArticle = (req, res, next) => {
    const { article_id } = req.params;
    const newComment = req.body;
    selectArticleById(article_id)
        .then(() => {
            insertCommentToArticle(newComment, article_id)
                .then((comment) => {
                    res.status(201).send(comment);
                })
                .catch((err) => {
                    next(err);
                });
        })
        .catch(next);
};

exports.patchArticleById = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    selectArticleById(article_id)
        .then(() => {
            updateArticleById(inc_votes, article_id)
                .then((article) => {
                    res.status(201).send(article);
                })
                .catch((err) => {
                    next(err);
                });
        })
        .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params;
    selectCommentById(comment_id)
        .then(() => {
            removeCommentById(comment_id)
                .then(() => res.status(204).send())
                .catch(next);
        })
        .catch(next);
};
