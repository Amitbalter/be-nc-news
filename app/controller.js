const { fetchEndpoints, fetchTopics } = require("./model");

function getEndpoints(req, res) {
    const endpoints = fetchEndpoints();
    res.status(200).send(endpoints);
}

function getTopics(req, res) {
    fetchTopics().then((result) => {
        res.status(200).send(result);
    });
}

module.exports = { getEndpoints, getTopics };
