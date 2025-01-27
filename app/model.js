function fetchEndpoints() {
    const endpointsJson = require("../endpoints.json");
    return endpointsJson;
}

module.exports = { fetchEndpoints };
