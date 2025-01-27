const { fetchEndpoints } = require("./model");

function getEndpoints(req, res) {
    const endpoints = fetchEndpoints();
    res.status(200).send(endpoints);
}

module.exports = { getEndpoints };
