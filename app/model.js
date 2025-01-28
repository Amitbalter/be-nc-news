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

exports.selectArticles = () => {
    return db
        .query(
            `SELECT articles.author, articles.title, articles.article_id, 
            articles.topic, articles.created_at, articles.votes, 
            article_img_url, COUNT(comments.article_id)::INT AS comment_count
            FROM articles
            LEFT JOIN comments ON articles.article_id = comments.article_id
            GROUP BY articles.article_id
            ORDER BY articles.created_at DESC;`
        )
        .then((result) => {
            return result.rows;
        });
};

exports.selectCommentsByArticle = (article_id) => {
    return db
        .query(
            `SELECT comments.comment_id, comments.votes, comments.created_at,
            comments.author, comments.body, comments.article_id
            FROM articles
            LEFT JOIN comments ON articles.article_id = comments.article_id
            WHERE articles.article_id = $1 
            AND comments.comment_id IS NOT NULL
            ORDER BY comments.created_at DESC;`,
            [article_id]
        )
        .then((result) => {
            const comments = result.rows;
            if (!comments) {
                return Promise.reject({
                    status: 404,
                    msg: `article does not exist`,
                });
            }
            return comments;
        });
};
