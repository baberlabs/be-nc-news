const {
  deleteCommentByArticleId,
  patchCommentByCommentId,
} = require("../controllers/comments.controllers");

const commentsRouter = require("express").Router();

commentsRouter
  .route("/:comment_id")
  .delete(deleteCommentByArticleId)
  .patch(patchCommentByCommentId);

module.exports = commentsRouter;
