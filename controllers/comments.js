const mongoose = require("mongoose");
const { Comment } = require('../models/comments')
const { Review } = require('../models/review')
const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR } = require("http-status-codes");

exports.postComment = async (req, res) => {
  const _id = req.params.reviewId
  try {
    const review = Review.findOne({ _id })
    if (!review) {
      return res.status().json({
        message: 'No review found'
      })
    }

    console.log(req.body)
    const newComment = {
        _id: new mongoose.Types.ObjectId(),
        comment: req.body.comment,
        reviewId: req.params.reviewId,
        author: req.userData._id
      };
      new Comment(newComment)
        .save()
        .then(story => {
          if (story) {
            res.status(OK).json({
              message: "comment Added successfully",
              story
            });
          }
        })
  } catch (err) {
    console.log(err);
    res.status(INTERNAL_SERVER_ERROR).json({
      message: err,
      status: "error"
    });
  }
}

exports.getAllComment = async (req, res) => {
    try {
      const comments = await Comment.find();
      if (comments.length >= 1) {
        res.status(OK).json({
          data: {
            commentCount: comments.length,
            comment: comments
          },
          status: "success"
        });
      }
      return res.status(BAD_REQUEST).json({
        message: "No Reviews has been Made",
        status: "error"
      });
    } catch (err) {
      console.log(err);
      res.status(INTERNAL_SERVER_ERROR).json({
        message: err,
        status: "error"
      });
    }
  };

  exports.getCommentForReviews = async (req, res) => {
    const { reviewId } = req.params;
    try {
      const comments = await Comment.find({ reviewId });
      if (comments.length >= 1) {
        res.status(OK).json({
          data: {
            reviewCount: comments.length,
            comments
          },
          status: "success"
        });
      }
      return res.status(BAD_REQUEST).json({
        message: "No comment has been Made for this review",
        status: "error"
      });
    } catch (err) {
      console.log(err);
      res.status(INTERNAL_SERVER_ERROR).json({
        message: err,
        status: "error"
      });
    }
  };

  exports.updateComment = async (req, res) => {
    const _id = req.params.id;
    const updateOps = {};
    for (const Ops of req.body) {
      updateOps[Ops.propName] = Ops.value;
    }
    await Comment.findOne({ _id }).then(async comment => {
      if (req.userData._id == comment.author) {
        await Comment.update({ _id }, { $set: updateOps })
          .then(room => {
            res.status(200).json(room);
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
          });
      } else {
        res.status(401).json({ message: "unAuthorized access" });
      }
    });
  };

  exports.deleteComment = (req, res) => {
    const _id = req.params.id;
    Room.deleteOne({ _id })
      .then(result => {
        res
          .status(OK)
          .json({ message: "comment Deleted Successfully", data: "success" });
      })
      .catch(err => {
        console.log(err);
        res.status(INTERNAL_SERVER_ERROR).json({
          error: err
        });
      });
  };