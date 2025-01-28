const app = require("../app/app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const endpointsJson = require("../endpoints.json");
const { articleData, commentData, topicData, userData } = data;

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET /api", () => {
    test("200: Responds with an object detailing the documentation for each endpoint", () => {
        return request(app)
            .get("/api")
            .expect(200)
            .then(({ body: endpoints }) => {
                expect(endpoints).toEqual(endpointsJson);
            });
    });
});

describe("GET /api/topics", () => {
    test("GET:200 sends an array of topics to the client", () => {
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({ body: topics }) => {
                expect(topics.length).toBe(topicData.length);
                topics.forEach((topic) => {
                    expect(typeof topic.slug).toBe("string");
                    expect(typeof topic.description).toBe("string");
                });
            });
    });
});
