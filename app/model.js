const db = require("../db/connection");
const format = require("pg-format");

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
    return db
        .query(
            `SELECT articles.author, articles.title, articles.article_id, 
            articles.topic, articles.created_at, articles.votes, articles.body,
            article_img_url, COUNT(comments.article_id)::INT AS comment_count
            FROM articles
            LEFT JOIN comments ON articles.article_id = comments.article_id
            WHERE articles.article_id = $1
            GROUP BY articles.article_id;`,
            [article_id]
        )
        .then((result) => {
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

exports.selectArticles = (sort_by = "created_at", order = "DESC", topic) => {
    return db.query("SELECT * FROM topics;").then((result) => {
        const allowedTopics = result.rows.map((row) => row.slug);
        const allowedSort_by = ["author", "title", "article_id", "topic", "created_at", "votes", "article_img_url", "comment_count"];
        const allowedOrder = ["ASC", "DESC"];

        let queryStr = `SELECT articles.author, articles.title, articles.article_id,
                articles.topic, articles.created_at, articles.votes,
                article_img_url, COUNT(comments.article_id)::INT AS comment_count
                FROM articles
                LEFT JOIN comments ON articles.article_id = comments.article_id \n`;

        if (!allowedTopics.includes(topic) && topic !== undefined) {
            return Promise.reject({ status: 400, msg: "Bad request" });
        } else if (topic) {
            queryStr += `WHERE articles.topic = '${topic}' \n`;
        }

        queryStr += `GROUP BY articles.article_id \n`;

        if (!allowedSort_by.includes(sort_by) || !allowedOrder.includes(order)) {
            return Promise.reject({ status: 400, msg: "Bad request" });
        } else {
            queryStr += `ORDER BY ${sort_by} ${order};`;
        }

        return db.query(queryStr).then((result) => {
            return result.rows;
        });
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

exports.insertCommentToArticle = ({ username, body }, article_id) => {
    const queryStr = format(
        `INSERT INTO comments 
        (body, votes, author, article_id) 
        VALUES %L RETURNING *;`,
        [[body, 0, username, article_id]]
    );
    return db.query(queryStr).then((result) => {
        return result.rows[0];
    });
};

exports.updateArticleById = (inc_votes, article_id) => {
    return db
        .query(
            `UPDATE articles
            SET votes = votes + $1 
            WHERE article_id = $2 
            RETURNING *;`,
            [inc_votes, article_id]
        )
        .then((result) => {
            return result.rows[0];
        });
};

exports.selectCommentById = (comment_id) => {
    return db.query(`SELECT * FROM comments WHERE comment_id=$1;`, [comment_id]).then((result) => {
        const comment = result.rows[0];
        if (!comment) {
            return Promise.reject({
                status: 404,
                msg: `comment does not exist`,
            });
        }
        return comment;
    });
};

exports.removeCommentById = (comment_id) => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1;`, [comment_id]);
};

exports.selectUsers = () => {
    return db.query("SELECT * FROM users;").then((users) => {
        return users.rows;
    });
};
