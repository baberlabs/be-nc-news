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
        expect(endpoints).toEqual(endpointData)
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
