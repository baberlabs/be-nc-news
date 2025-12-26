# NC News API

A production-style REST API for a news aggregation platform, designed around explicit SQL, relational integrity, and predictable failure modes.

Built with **Node.js**, **Express**, and **PostgreSQL**, with full test coverage and defensive error handling.

This API exposes articles, topics, users, and comments, supporting filtering, sorting, pagination, and resource mutation, all backed by a relational schema with enforced integrity.

---

## Live API

**Base URL**  
https://be-nc-news-8igb.onrender.com/api

Note: The hosted instance may experience cold starts due to free-tier hosting constaints

**Available endpoints index**

```http
GET /api
```

Returns a structured list of available routes, expected queries, and example responses.

---

## What This API Does

- Serves articles with comment counts, sorting, filtering, and pagination
- Allows clients to create, update, and delete articles and comments
- Exposes users and topics as first-class resources
- Returns consistent, meaningful HTTP status codes
- Fails loudly and predictably when clients misbehave

This API is designed to behave like a deployable service rather than a demonstration stub.

---

## Core Features

- Full CRUD for **articles** and **comments**
- Topic and user retrieval
- Query-driven sorting (`sort_by`, `order`)
- Pagination with total count metadata (`limit`, `page`)
- Centralised error handling
- Comprehensive integration test suite

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express
- **Database:** PostgreSQL
- **Query Layer:** `pg` (node-postgres)
- **Testing:** Jest, Supertest
- **Hosting:**
  - API: Render
  - Database: Supabase (PostgreSQL)

---

## API Structure

All endpoints are namespaced under `/api`.

| Resource         | Endpoints                            |
| ---------------- | ------------------------------------ |
| Topics           | `/api/topics`                        |
| Articles         | `/api/articles`                      |
| Single Article   | `/api/articles/:article_id`          |
| Article Comments | `/api/articles/:article_id/comments` |
| Single Comment   | `/api/comments/:comment_id`          |
| Users            | `/api/users`                         |
| Single User      | `/api/users/:username`               |

For request/response schemas and supported query parameters, see:

```http
GET /api
```

---

## Local Development

### Prerequisites

- Node.js (LTS recommended)
- PostgreSQL

---

### Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/baberlabs/be-nc-news.git
cd be-nc-news
npm install
```

Create environment files:

```bash
echo "PGDATABASE=nc_news" > .env.development
echo "PGDATABASE=nc_news_test" > .env.test
```

Create and seed the databases:

```bash
npm run setup-dbs
npm run seed
```

Start the server:

```bash
npm start
```

---

## Running Tests

```bash
npm test
```

Test behaviour:

- Database is reseeded before each test run
- Integration tests cover all routes and error cases
- Connections are closed cleanly after execution

---

## Design Decisions

- **Explicit SQL** over ORMs for predictability and clarity
- **Separation of concerns** between routes, controllers, and models
- **Defensive validation** for queries, params, and request bodies
- **Centralised error middleware** to keep controllers readable
- **Relational integrity enforced at the database level**

The code prioritises correctness and readability over cleverness.

---

## Acknowledgements

This project was developed as part of a **Digital Skills Bootcamp in Software Development** delivered by **Northcoders**, a UK-based training provider.
