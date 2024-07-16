const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/");
const db = require("../db/connection");
const endpointData = require("../endpoints.json");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("*", () => {
  test("GET:404 invalid api endpoint", () => {
    return request(app)
      .get("/api/not-an-endpoint")
      .expect(404)
      .then(({ body: { message } }) => expect(message).toBe("API Not Found"));
  });
});

describe("/api", () => {
  test("GET:200 get all endpoints available", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) =>
        expect(endpoints).toEqual(endpointData),
      );
  });
});

describe("/api/topics", () => {
  test("GET:200 get all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("/api/articles", () => {
  test("GET:200 get all articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(article).not.toHaveProperty("body");
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("GET:200 articles are sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) =>
        expect(articles).toBeSortedBy("created_at", { descending: true }),
      );
  });
});

describe("/api/articles/:article_id", () => {
  test("GET:200 get an article by its id", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual({
          article_id: 2,
          title: "Sony Vaio; or, The Laptop",
          topic: "mitch",
          author: "icellusedkars",
          body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
          created_at: "2020-10-16T05:03:00.000Z",
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          votes: 0,
        });
      });
  });
  test("GET:404 article with this id does not exist", () => {
    return request(app)
      .get("/api/articles/1996")
      .expect(404)
      .then(({ body: { message } }) => expect(message).toBe("Not Found"));
  });
  test("GET:400 invalid article id", () => {
    return request(app)
      .get("/api/articles/not-a-number")
      .expect(400)
      .then(({ body: { message } }) => expect(message).toBe("Bad Request"));
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET:200 get all comments for an article, each with comment_id, body, article_id, author, votes and created_at property", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(11);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            body: expect.any(String),
            article_id: expect.any(Number),
            author: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
          });
        });
      });
  });

  test("GET:200 comments should be served with the most recent comments first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) =>
        expect(comments).toBeSortedBy("created_at", { descending: true }),
      );
  });

  test("GET:200 get empty array when comments do not exist for an existing article", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(200)
      .then(({ body: { comments } }) => expect(comments).toEqual([]));
  });

  test("GET:404 get an error when article does not exist", () => {
    return request(app)
      .get("/api/articles/50/comments")
      .expect(404)
      .then(({ body: { message } }) =>
        expect(message).toBe("Article Not Found"),
      );
  });

  test("GET:400 get an error when article_id is invalid", () => {
    return request(app)
      .get("/api/articles/not-a-number/comments")
      .expect(400)
      .then(({ body: { message } }) => expect(message).toBe("Bad Request"));
  });

  test("POST:201 add a comment for an article", () => {
    return request(app)
      .post("/api/articles/8/comments")
      .send({
        username: "lurker",
        body: "Does look like Mitch! Maybe Mitch is an immortal vampire, living among us from ages old ~",
      })
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toEqual({
          comment_id: expect.any(Number),
          body: "Does look like Mitch! Maybe Mitch is an immortal vampire, living among us from ages old ~",
          article_id: 8,
          author: "lurker",
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });

  test("POST:404 get an error when article does not exist", () => {
    return request(app)
      .post("/api/articles/50/comments")
      .send({
        username: "lurker",
        body: "random comment",
      })
      .expect(404)
      .then(({ body: { message } }) =>
        expect(message).toBe("Article Not Found"),
      );
  });

  test("POST:404 get an error when username does not exist", () => {
    return request(app)
      .post("/api/articles/4/comments")
      .send({
        username: "baberlabs",
        body: "another random comment",
      })
      .expect(404)
      .then(({ body: { message } }) => expect(message).toBe("User Not Found"));
  });

  test("POST:400 get an error when article_id is invalid", () => {
    return request(app)
      .post("/api/articles/not-a-number/comments")
      .send({
        username: "baberlabs",
        body: "some random comment",
      })
      .expect(400)
      .then(({ body: { message } }) => expect(message).toBe("Bad Request"));
  });

  test("POST:400 get an error when either username or body is missing", () => {
    return request(app)
      .post("/api/articles/4/comments")
      .send({ body: "and another random comment" })
      .expect(400)
      .then(({ body: { message } }) => expect(message).toBe("Bad Request"));
  });
});
