# Northcoders News API

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)

## Setup Instructions

1. Clone this project on your local machine:

```bash
$ git clone https://github.com/baberlabs/be-nc-news.git
```

2. Create a new GitHub repo, without a README.md, .gitignore and LICENSE file

```url
https://github.com/new
```

3. Run the following commands in your terminal:

```bash

$ cd be-nc-news
$ git remote set-url origin https://github.com/<your-username>/<your-repo-name>.git
$ git branch -M main
$ git push -u origin main

```

4. Create two .env files, one for testing and one for development

```bash
$ echo "PGDATABASE=nc_news" > .env.development
$ echo "PGDATABASE=nc_news_test" > .env.test
```

5. Install dependencies and dev dependencies

```bash
$ npm install
```

6. Run the database setup

```bash
$ npm run setup-dbs
```

And that's it! You should now be able to work on this project.
