const deleteCommentById = require("../models/comments.models");

const deleteComment = (req, res, next) => {
  const commentId = req.params.comment_id;

  if (isNaN(commentId)) {
    return res.status(400).send({ message: "Invalid comment id" });
  }

  deleteCommentById(commentId)
    .then((result) => {
      if (result.length === 0) {
        return res.status(404).send({ message: "Comment not found" });
      } else {
        res.status(204).send();
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = deleteComment;
