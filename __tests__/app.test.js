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
    test("Get: 200 Responds with an object detailing the documentation for each endpoint", () => {
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

describe("GET /api/articles/:article_id", () => {
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
    test("GET:200 gets in addition retrieves comment_count for article", () => {
        return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body: article }) => {
                expect(article.comment_count).toBe(11);
            });
    });
});

describe("PATCH /api/articles/:article_id", () => {
    test("PATCH:201 updates article with new vote count and returns article to client", () => {
        const newVotes = { inc_votes: 1 };
        return request(app)
            .patch("/api/articles/1")
            .send(newVotes)
            .expect(201)
            .then(({ body: article }) => {
                expect(article.title).toBe("Living in the shadow of a great man");
                expect(article.topic).toBe("mitch");
                expect(article.author).toBe("butter_bridge");
                expect(article.body).toBe("I find this existence challenging");
                expect(typeof article.created_at).toBe("string");
                expect(article.votes).toBe(101);
                expect(article.article_img_url).toBe(
                    "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
                );
            });
    });
    test("PATCH:400 responds with an appropriate status and error message when provided with invalid vote_inc", () => {
        const newVotes = { inc_votes: "invalid vote_inc" };
        return request(app)
            .patch("/api/articles/1")
            .send(newVotes)
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe("Bad request");
            });
    });
});

describe("GET /api/articles", () => {
    test("GET:200 sends an array of articles to the client by default sorted by date in descending order", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body: articles }) => {
                expect(articles.length).toBe(13);
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
    test("GET:200 sends an array of articles to the client sorted by comment_count in ascending order", () => {
        return request(app)
            .get("/api/articles?sort_by=comment_count&order=ASC")
            .expect(200)
            .then(({ body: articles }) => {
                expect(articles.length).toBe(13);
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
                expect(articles).toBeSortedBy("comment_count", { ascending: true });
            });
    });
    test("GET:200 sends an array of articles to the client sorted by votes in descending order", () => {
        return request(app)
            .get("/api/articles?sort_by=votes")
            .expect(200)
            .then(({ body: articles }) => {
                expect(articles.length).toBe(13);
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
                expect(articles).toBeSortedBy("votes", { descending: true });
            });
    });
    test("GET:200 sends an array of articles to the client sorted by date created in ascending order", () => {
        return request(app)
            .get("/api/articles?order=ASC")
            .expect(200)
            .then(({ body: articles }) => {
                expect(articles.length).toBe(13);
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
                expect(articles).toBeSortedBy("created_at", { ascending: true });
            });
    });
    test("GET:200 sends an array of articles to the client filtered by topic", () => {
        return request(app)
            .get("/api/articles?topic=mitch")
            .expect(200)
            .then(({ body: articles }) => {
                expect(articles.length).toBe(12);
                articles.forEach((article) => {
                    expect(typeof article.author).toBe("string");
                    expect(typeof article.title).toBe("string");
                    expect(typeof article.article_id).toBe("number");
                    expect(article.topic).toBe("mitch");
                    expect(typeof article.created_at).toBe("string");
                    expect(typeof article.votes).toBe("number");
                    expect(typeof article.article_img_url).toBe("string");
                    expect(typeof article.comment_count).toBe("number");
                });
            });
    });
    test("GET:200 sends an empty array when topic has no associated articles", () => {
        return request(app)
            .get("/api/articles?topic=paper")
            .expect(200)
            .then(({ body: articles }) => {
                expect(articles).toEqual([]);
            });
    });
    test("GET:400 sends an appropriate status and error message when given an invalid sort_by query", () => {
        return request(app)
            .get("/api/articles/sort_by=not_sort")
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe("Bad request");
            });
    });
    test("GET:400 sends an appropriate status and error message when given an invalid order query", () => {
        return request(app)
            .get("/api/articles/order=not_order")
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe("Bad request");
            });
    });
    test("GET:400 sends an appropriate status and error message when given an invalid topic query", () => {
        return request(app)
            .get("/api/articles/topic=not_topic")
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe("Bad request");
            });
    });
});

describe("GET /api/articles/:article_id/comments", () => {
    test("GET:200 gets all comments for an article sorted by date descending", () => {
        return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body: comments }) => {
                comments.forEach((comment) => {
                    expect(typeof comment.comment_id).toBe("number");
                    expect(typeof comment.votes).toBe("number");
                    expect(typeof comment.created_at).toBe("string");
                    expect(typeof comment.author).toBe("string");
                    expect(typeof comment.body).toBe("string");
                    expect(typeof comment.article_id).toBe("number");
                });
                expect(comments).toBeSortedBy("created_at", { descending: true });
            });
    });
    test("GET:200 returns empty array for article with no comments.", () => {
        return request(app)
            .get("/api/articles/2/comments")
            .expect(200)
            .then(({ body: comments }) => {
                expect(comments.length).toBe(0);
                comments.forEach((comment) => {
                    expect(typeof comment.comment_id).toBe("number");
                    expect(typeof comment.votes).toBe("number");
                    expect(typeof comment.created_at).toBe("string");
                    expect(typeof comment.author).toBe("string");
                    expect(typeof comment.body).toBe("string");
                    expect(typeof comment.article_id).toBe("number");
                });
            });
    });
    test("GET:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
        return request(app)
            .get("/api/articles/999/comments")
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe("article does not exist");
            });
    });
    test("GET:400 sends an appropriate status and error message when given an invalid id", () => {
        return request(app)
            .get("/api/articles/not-an-article/comments")
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe("Bad request");
            });
    });
});

describe("POST /api/articles/:article_id/comments", () => {
    test("POST:201 adds a new comment to the correct article and sends the comment back to the client", () => {
        const newComment = {
            username: "butter_bridge",
            body: "new comment",
        };
        return request(app)
            .post("/api/articles/2/comments")
            .send(newComment)
            .expect(201)
            .then(({ body: comment }) => {
                expect(typeof comment.comment_id).toBe("number");
                expect(comment.votes).toBe(0);
                expect(typeof comment.created_at).toBe("string");
                expect(comment.author).toBe("butter_bridge");
                expect(comment.body).toBe("new comment");
                expect(comment.article_id).toBe(2);
            });
    });
    test("POST:400 responds with an appropriate status and error message when provided without a username", () => {
        const newComment = {
            body: "new comment",
        };
        return request(app)
            .post("/api/articles/2/comments")
            .send(newComment)
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe("Bad request");
            });
    });
    test("POST:400 responds with an appropriate status and error message when provided without a body", () => {
        const newComment = {
            username: "new_user",
        };
        return request(app)
            .post("/api/articles/2/comments")
            .send(newComment)
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe("Bad request");
            });
    });
    test("POST:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
        const newComment = {
            username: "new_user",
            body: "new comment",
        };
        return request(app)
            .post("/api/articles/999/comments")
            .send(newComment)
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe("article does not exist");
            });
    });
    test("POST:400 sends an appropriate status and error message when given an invalid id", () => {
        const newComment = {
            username: "new_user",
            body: "new comment",
        };
        return request(app)
            .post("/api/articles/not-an-article/comments")
            .send(newComment)
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe("Bad request");
            });
    });
});

describe("DELETE /api/comments/:comment_id", () => {
    test("DELETE:204 deletes the specified comment and responds with no content", () => {
        return request(app).delete("/api/comments/1").expect(204);
    });
    test("DELETE:404 responds with an appropriate status and error message when given a non-existent id", () => {
        return request(app)
            .delete("/api/comments/999")
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe("comment does not exist");
            });
    });
    test("DELETE:400 responds with an appropriate status and error message when given an invalid id", () => {
        return request(app)
            .delete("/api/comments/not-a-comment")
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe("Bad request");
            });
    });
});

describe("GET /api/users", () => {
    test("GET:200 sends an array of users to the client", () => {
        return request(app)
            .get("/api/users")
            .expect(200)
            .then(({ body: users }) => {
                expect(users.length).toBe(userData.length);
                users.forEach((user) => {
                    expect(typeof user.username).toBe("string");
                    expect(typeof user.name).toBe("string");
                    expect(typeof user.avatar_url).toBe("string");
                });
            });
    });
});
