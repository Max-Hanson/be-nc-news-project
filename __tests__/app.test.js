const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});
describe("GET /api/topics", () => {
  test("should respond with array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const body = response.body;
        expect(body.topics.length).toBe(3);
        body.topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
  test("should respond with error message if endpoint not found", () => {
    return request(app)
      .get("/api/incorrectendpoint")
      .expect(404)
      .then((response) => {
        const body = response.body;
        expect(body.message).toEqual("Endpoint not found");
      });
  });
});
describe("GET /api/articles/:article_id", () => {
  test("should respond with correct article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        const body = response.body;

        expect(body.article).toEqual({
          article_id: 1,
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          body: "I find this existence challenging",
          topic: "mitch",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });

  test("article not found", () => {
    return request(app)
      .get("/api/articles/30")
      .expect(404)
      .then((response) => {
        expect(response.body.err).toBe("Not found");
      });
  });
  test("id not a number", () => {
    return request(app)
      .get("/api/articles/A")
      .expect(400)
      .then((response) => {
        expect(response.body.error).toBe("Bad Request");
      });
  });
});
describe("GET /api/articles", () => {
  test("responds with array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const body = response.body;

        expect(body.articles.length).toEqual(13);
        body.articles.forEach((article) => {
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");
          expect(article).not.toHaveProperty("body");
        });
      });
  });
  test("should respond with articles ordered by date", () => {
    return request(app)
      .get("/api/articles?&sort_by=created_at&order=desc")
      .expect(200)
      .then((response) => {
        const body = response.body;
        expect(body.articles.length).toEqual(13);

        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("should respond with error message if endpoint not found", () => {
    return request(app)
      .get("/api/incorrectendpoint")
      .expect(404)
      .then((response) => {
        const body = response.body;
        expect(body.message).toEqual("Endpoint not found");
      });
  });
});
describe("GET /api/articles/:article_id/comments", () => {
  test("should respond with array of comments given an article", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then((response) => {
        const body = response.body;

        expect(body.comments.length).toEqual(2);
        body.comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id");
        });
      });
  });
  test("should respond with most recent comments first", () => {
    return request(app)
      .get("/api/articles/9/comments?&sort_by=created_at&order=desc")
      .expect(200)
      .then((response) => {
        const body = response.body;
        expect(body.comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("article not found", () => {
    return request(app)
      .get("/api/articles/30")
      .expect(404)
      .then((response) => {
        expect(response.body.err).toBe("Not found");
      });
  });
  test("id not a number", () => {
    return request(app)
      .get("/api/articles/A")
      .expect(400)
      .then((response) => {
        expect(response.body.error).toBe("Bad Request");
      });
  });
});
describe.only("POST /api/articles/:article_id/comments", () => {
  test("should respond with a posted comment", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({
        author: "butter_bridge",
        body: "new comment",
      })
      .expect(201)
      .then((response) => {
        expect(response.body.comment.author).toBe("butter_bridge");
      });
  });
  test("should respond with 404 if no article_id", () => {
    return request(app)
      .post("/api/articles//comments")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toEqual("Endpoint not found");
      });
  });
  test("respond with 400 if there is no username or body", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .expect(400)
      .send({})
      .then((response) => {
        expect(response.body.message).toEqual("Bad Request");
      });
  });
});
