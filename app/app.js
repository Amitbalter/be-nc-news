const express = require("express");
const { getEndpoints, getTopics } = require("./controller");
const app = express();

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

module.exports = app;
