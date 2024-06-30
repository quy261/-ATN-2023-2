const Comment = require("../models/commentSchema.js");
const mongoose = require("mongoose");

const commentCreate = async (req, res) => {
  try {
    const comment = new Comment({
      name: req.body.name,
      userId: req.body.userId,
      comment: req.body.comment,
    });
    const result = await comment.save();
    res.send(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getCommentById = async (req, res) => {
  try {
    const studentId = req.params.id;
    let comments = await Comment.find({ name: studentId });
    if (comments.length > 0) {
      res.send(comments);
    } else {
      res.send({ message: "No commentes found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

module.exports = {
  commentCreate,
  getCommentById,
};
