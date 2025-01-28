const app = require("../app/app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const endpointsJson = require("../endpoints.json");
const { articleData, commentData, topicData, userData } = data;

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("/api", () => {
    test("Get: 200 Responds with an object detailing the documentation for each endpoint", () => {
        return request(app)
            .get("/api")
            .expect(200)
            .then(({ body: endpoints }) => {
                expect(endpoints).toEqual(endpointsJson);
            });
    });
});

describe("/api/topics", () => {
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

describe("/api/articles/:article_id", () => {
    test("GET:200 gets an article by its id.", () => {
        return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body: article }) => {
                expect(article.title).toBe("Living in the shadow of a great man");
                expect(article.topic).toBe("mitch");
                expect(article.author).toBe("butter_bridge");
                expect(article.body).toBe("I find this existence challenging");
                expect(typeof article.created_at).toBe("string");
                expect(article.votes).toBe(100);
                expect(article.article_img_url).toBe(
                    "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
                );
            });
    });
    test("GET:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
        return request(app)
            .get("/api/articles/999")
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe("article does not exist");
            });
    });
    test("GET:400 sends an appropriate status and error message when given an invalid id", () => {
        return request(app)
            .get("/api/articles/not-an-article")
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe("Bad request");
            });
    });
});

describe("/api/articles", () => {
    test("GET:200 sends an array of articles to the client sorted by date in descending order", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body: articles }) => {
                expect(articles.length).toBe(articleData.length);
                articles.forEach((article) => {
                    expect(typeof article.author).toBe("string");
                    expect(typeof article.title).toBe("string");
                    expect(typeof article.article_id).toBe("number");
                    expect(typeof article.topic).toBe("string");
                    expect(typeof article.created_at).toBe("string");
                    expect(typeof article.votes).toBe("number");
                    expect(typeof article.article_img_url).toBe("string");
                    expect(typeof article.comment_count).toBe("number");
                });
                expect(articles).toBeSortedBy("created_at", { descending: true });
            });
    });
});
