# Northcoders News API

As part of the backend project, I built the [Northcoders News API](https://be-nc-news-8igb.onrender.com/api/) API using Express and PostgreSQL and deployed it using Supabase and Render. This API mimics a real-world backend service, such as Reddit, with users, articles, comments, and topics.

> The front end of this project will start in three weeks. (To Be Continued)

## Requirements

- Node 22.3.0
- PostgreSQL 16.3

It may or may not work with other versions of Node and PostgreSQL.

## Setup Instructions

### 1. Clone the project

```bash
$ git clone https://github.com/baberlabs/be-nc-news.git
```

### 2. Install dependencies

```bash
$ npm install
```

### 3. Create .env files
One will be for testing and another for development.

```bash
$ echo "PGDATABASE=nc_news" > .env.development
$ echo "PGDATABASE=nc_news_test" > .env.test
```


### 6. Run the database setup script

```bash
$ npm run setup-dbs
```

### 7. Seed the database

For the tests, there is no need to seed the database explicitly. Running the test will reseed the test database for each test automatically.

For development purposes, the development database can be seeded using:

```bash
$ npm run seed
```

### 8. Start the server

```bash
$ npm run start
```

### 9. Run tests

```bash
$ npm run test
```


## Endpoints

This project currently has the following endpoints:

- `GET /api`: get more information regarding all endpoints available
- `GET /api/topics`: get all topics
- `GET /api/articles`: get all articles (queries: sort_by, order, topic, limit, page)
- `GET /api/articles/:article_id`: get an article by article id (queries: limit, page)
- `PATCH /api/articles/:article_id`: update an article by article id
- `GET /api/comments/:comment_id`: get a comment by article id
- `POST /api/comments/:comment_id`: post a comment by article id
- `DELETE /api/comments/:comment_id`: delete a comment by article id
- `GET /api/users`: get all users


And that's it! You should now be able to work on this project.

## Author

- **Baber Khan** - [GitHub](https://github.com/baberlabs) - [LinkedIn](https://linkedin.com/in/baberr) - [Personal Website](https://baberr.com) - [WhatsApp](https://wa.me/+447438234827)

## Acknowledgements

This portfolio project was created as part of a Digital Skills Bootcamp in Software Development provided by [Northcoders](https://northcoders.com)
