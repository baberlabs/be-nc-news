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

  test("GET:200 articles are sorted by date in descending order (by default)", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("GET:200 articles accept sorting by any valid column", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy("title", { descending: true });
      });
  });

  test("GET:200 articles accept ordering by asc|desc", () => {
    return request(app)
      .get("/api/articles?sort_by=title&&order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy("title", { descending: false });
      });
  });

  test("GET:200 articles accept filtering by topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(12);
        articles.forEach((article) => {
          expect(article).toHaveProperty("topic", "mitch");
        });
      });
  });

  test("GET:400 responds with empty array if topic does not exist", () => {
    return request(app)
      .get("/api/articles?topic=invalid")
      .expect(200)
      .then(({ body: { articles } }) => expect(articles).toEqual([]));
  });

  test("GET:400 invalid sort_by query", () => {
    return request(app)
      .get("/api/articles?sort_by=invalid")
      .expect(400)
      .then(({ body: { message } }) =>
        expect(message).toBe("Bad Request: Invalid Query"),
      );
  });

  test("GET:400 invalid order query", () => {
    return request(app)
      .get("/api/articles?order=invalid")
      .expect(400)
      .then(({ body: { message } }) =>
        expect(message).toBe("Bad Request: Invalid Query"),
      );
  });

  // for POST:201 /api/articles
  //
  // Although the ticket says to use 'author', I am using
  // 'username' because that's what I've been using in
  // all the previous post and patch requests.
  //
  // 'username' in the request body, and
  // 'author' in the response we get from model
  //
  // Being consistent!

  test("POST:201 add a new article", () => {
    return request(app)
      .post("/api/articles")
      .send({
        username: "lurker",
        title: "I don't always lurk",
        body: "Of course, I'd make you believe that. But the truth is indeed as your gut instinct says...",
        topic: "cats",
      })
      .expect(201)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 14,
          title: "I don't always lurk",
          topic: "cats",
          author: "lurker",
          body: "Of course, I'd make you believe that. But the truth is indeed as your gut instinct says...",
          created_at: expect.any(String),
          votes: 0,
          comment_count: 0,
          article_img_url: "https://defaulturl.com",
        });
      });
  });

  test("POST:404 user not found", () => {
    return request(app)
      .post("/api/articles")
      .send({
        username: "not-a-user",
        title: "I don't always lurk",
        body: "Of course, I'd make you believe that. But the truth is indeed as your gut instinct says...",
        topic: "cats",
      })
      .expect(404)
      .then(({ body: { message } }) => expect(message).toBe("User Not Found"));
  });

  test("POST:404 topic not found", () => {
    return request(app)
      .post("/api/articles")
      .send({
        username: "lurker",
        title: "I don't always lurk",
        body: "Of course, I'd make you believe that. But the truth is indeed as your gut instinct says...",
        topic: "not-a-topic",
      })
      .expect(404)
      .then(({ body: { message } }) => expect(message).toBe("Topic Not Found"));
  });

  test("POST:400 missing any property in the request body: author, title, body or topic", () => {
    return request(app)
      .post("/api/articles")
      .send({
        username: "lurker",
        topic: "cats",
      })
      .expect(400)
      .then(({ body: { message } }) => expect(message).toBe("Bad Request"));
  });
});

describe("/api/articles/:article_id", () => {
  test("GET:200 get an article by its id", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: "2020-11-03T09:12:00.000Z",
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          votes: 0,
          comment_count: 2,
        });
      });
  });

  test("GET:404 article with this id does not exist", () => {
    return request(app)
      .get("/api/articles/1996")
      .expect(404)
      .then(({ body: { message } }) =>
        expect(message).toBe("Article Not Found"),
      );
  });

  test("GET:400 invalid article id", () => {
    return request(app)
      .get("/api/articles/not-a-number")
      .expect(400)
      .then(({ body: { message } }) => expect(message).toBe("Bad Request"));
  });

  test("PATCH:200 update an article by id", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 5000 })
      .expect(200)
      .then(({ body: { article } }) =>
        expect(article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 5100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        }),
      );
  });

  test("PATCH:404 article id does not exist", () => {
    return request(app)
      .patch("/api/articles/50")
      .send({ inc_votes: 5 })
      .expect(404)
      .then(({ body: { message } }) =>
        expect(message).toBe("Article Not Found"),
      );
  });

  test("PATCH:400 invalid article id", () => {
    return request(app)
      .patch("/api/articles/not-a-number")
      .send({ inc_votes: 5 })
      .expect(400)
      .then(({ body: { message } }) => expect(message).toBe("Bad Request"));
  });

  test("PATCH:400 request body is missing inc_votes", () => {
    return request(app)
      .patch("/api/articles/4")
      .send({})
      .expect(400)
      .then(({ body: { message } }) => expect(message).toBe("Bad Request"));
  });

  test("PATCH:400 inc_votes is not valid", () => {
    return request(app)
      .patch("/api/articles/4")
      .send({ inc_votes: "not a number" })
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

describe("/api/comments/:comment_id", () => {
  test("DELETE:204 delete comment by id", () => {
    return request(app).delete("/api/comments/2").expect(204);
  });

  test("DELETE:404 comment does not exist", () => {
    return request(app)
      .delete("/api/comments/1000")
      .expect(404)
      .then(({ body: { message } }) =>
        expect(message).toBe("Comment Not Found"),
      );
  });

  test("DELETE:400 invalid comment id", () => {
    return request(app)
      .delete("/api/comments/not-a-number")
      .expect(400)
      .then(({ body: { message } }) => expect(message).toBe("Bad Request"));
  });

  test("PATCH:200 update the votes on a comment by comment_id", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: 5 })
      .expect(200)
      .then(
        ({ body: { comment } }) => expect(comment.votes).toBe(21), // originally 16
      );
  });

  test("PATCH:404 comment does not exist", () => {
    return request(app)
      .patch("/api/comments/150")
      .send({ inc_votes: 5 })
      .expect(404)
      .then(({ body: { message } }) =>
        expect(message).toBe("Comment Not Found"),
      );
  });

  test("PATCH:400 invalid comment id", () => {
    return request(app)
      .patch("/api/comments/not-a-number")
      .send({ inc_votes: 5 })
      .expect(400)
      .then(({ body: { message } }) => expect(message).toBe("Bad Request"));
  });

  test("PATCH:400 inc_votes is missing", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({})
      .expect(400)
      .then(({ body: { message } }) => expect(message).toBe("Bad Request"));
  });

  test("PATCH:400 inc_votes is not a number", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: "not-a-number" })
      .expect(400)
      .then(({ body: { message } }) => expect(message).toBe("Bad Request"));
  });
});

describe("/api/users", () => {
  test("GET:200 get all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("/api/users/:username", () => {
  test("GET:200 get a user by username", () => {
    return request(app)
      .get("/api/users/lurker")
      .expect(200)
      .then(({ body: { user } }) =>
        expect(user).toMatchObject({
          username: "lurker",
          name: "do_nothing",
          avatar_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        }),
      );
  });

  test("GET:404 get error when username does not exist", () => {
    return request(app)
      .get("/api/users/not-a-user")
      .expect(404)
      .then(({ body: { message } }) => expect(message).toBe("User Not Found"));
  });
});
