const { fetchEndpoints, selectTopics, selectArticleById } = require("./model");

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
        .catch((err) => {
            next(err);
        });
};
