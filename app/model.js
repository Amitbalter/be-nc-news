const db = require("../db/connection");

exports.fetchEndpoints = () => {
    const endpointsJson = require("../endpoints.json");
    return endpointsJson;
};

exports.selectTopics = () => {
    return db.query("SELECT * FROM topics;").then((topics) => {
        return topics.rows;
    });
};

exports.selectArticleById = (article_id) => {
    return db.query("SELECT * FROM articles WHERE article_id = $1;", [article_id]).then((result) => {
        const article = result.rows[0];
        if (!article) {
            return Promise.reject({
                status: 404,
                msg: `article does not exist`,
            });
        }
        return article;
    });
};
