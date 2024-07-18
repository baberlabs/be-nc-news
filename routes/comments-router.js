const {
  deleteCommentByArticleId,
} = require("../controllers/comments.controllers");

const commentsRouter = require("express").Router();

commentsRouter.route("/:comment_id").delete(deleteCommentByArticleId);

module.exports = commentsRouter;
