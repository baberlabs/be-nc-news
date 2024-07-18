const { getEndpoints } = require("../controllers/endpoints.controllers");

const apiRouter = require("express").Router();

const articlesRouter = require("./articles-router");
const usersRouter = require("./users-router");
const commentsRouter = require("./comments-router");
const topicsRouter = require("./topics-router");

apiRouter.use("/articles", articlesRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/topics", topicsRouter);

apiRouter.route("/").get(getEndpoints);

module.exports = apiRouter;
