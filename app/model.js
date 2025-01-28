const db = require("../db/connection");

function fetchEndpoints() {
    const endpointsJson = require("../endpoints.json");
    return endpointsJson;
}

function fetchTopics() {
    return db.query("SELECT * FROM topics;").then((topics) => {
        return topics.rows;
    });
}

module.exports = { fetchEndpoints, fetchTopics };
