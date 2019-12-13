const Blog = require("../models/blog");
const httpStatus = require("http-status-codes");
const mongoose = require("mongoose");
const upload = require('../multer')

const fs = require('fs')
const cloudinary = require('../cloudinary');

exports.blogPost = async (req, res) => {
  Blog.find({ title : req.body.title.toLowerCase() }).then(async rest => {
    console.log(rest)
    if(rest.length >= 1){
      return  res.status(httpStatus.OK).json({
        message: "Post Already Exists Try another",
      });
    }
    const uploader = async path => await cloudinary.uploads(path, "Images");
    if (req.method === "POST") {
      const urls = [];
      const files = req.files;
      for (const file of files) {
        const { path } = file;
        const newPath = await uploader(path);

        urls.push(newPath);
        console.log('1',newPath)
        fs.unlinkSync(path);
      }

        const newPost = {
          title: req.body.title.toLowerCase(),
          content: req.body.content,
          image: urls,
          // author: req.userData._id
        };
        new Blog(newPost)
          .save()
          .then(story => {
            if (story) {
              res.status(httpStatus.OK).json({
                message: "Post Added successfully",
                story
              });
            }
          })
          .catch(err => {
            console.log(err);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err });
          });
    
  } else {
    res.status(405).json({
      err: "images not uploaded successfully"
    });
  }}).catch(err => {
    console.log(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err });
  });
  
};

exports.getBlogs = (req, res) => {
  Blog.find()
    .populate("user")
    .then(post => {
      if (post) {
        return res.status(httpStatus.OK).json({
          status: "success",
          postCount: post.length,
          post
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err });
    });
};

exports.getBlog = (req, res) => {
  const _id = req.params.id;
  Blog.findOne({ _id })
    .populate("author")
    .populate("comments.commentUser")
    .then(post => {
      if (post) {
        res.status(httpStatus.OK).json({
          status: "success",
          post
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err });
    });
};

exports.deleteAPost = (req, res) => {
  const _id = req.params.id;
  Blog.deleteOne({ _id })
    .then(() => {
      res.status(httpStatus.OK).json({ message: "Post Deleted Successfully" });
    })
    .catch(err => {
      console.log(err);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err });
    });
};

exports.commentOn = async (req, res) => {
  const _id = req.params.id;
  await Blog.findOne({ _id }).then(post => {
    const newComment = {
      commentId: new mongoose.Types.ObjectId(),
      commentBody: req.body.commentBody,
      commentUser: req.userData._id
    };

    //push
    post.comments.unshift(newComment);
    post
      .save()
      .then(story => {
        res.status(httpStatus.OK).json(story);
      })
      .catch(err => {
        console.log(err);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err });
      });
  });
};

exports.updateStory = async (req, res) => {
  const _id = req.params.id;
  const file = req.files.image;
  const md5 = file.md5;
  await Blog.findOne({ _id })
    .populate("user")
    .then(story => {
      if (story.md5 === md5) {
        res.status(httpStatus.OK).json({
          status: "error",
          message: "Please do not uploaad the same image twice"
        });
      } else {
        cloudinary.uploader
          .upload(file.tempFilePath, function(err, result) {
            if (err) {
              return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: "error",
                message: "something  went wrong"
              });
            }

            story.title = req.body.title;
            story.content = req.body.content;
            story.image = result.url;
            story.md5 = md5;

            story.save().then(stor => {
              res.status(httpStatus.OK).json({
                status: "success",
                data: stor
              });
            });
          })
          .catch(err => {
            console.log(err);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err });
          });
      }
    });
};

exports.getComment = (req, res) => {
  const _id = req.params.id;
  Blog.find({ "comments._id": _id })
    .populate("comments.commentUser")
    .then(story => {
      if (story) {
        const comment = story;
        if (comment[0]) {
          const cont = comment[0].comments.filter(com => com._id == _id);
          res.status(httpStatus.OK).json({
            status: "success",
            data: cont
          });
        } else {
          res.status(httpStatus.BAD_REQUEST).json({
            status: "error",
            data: "No such comment"
          });
        }
      }
    })
    .catch(err => {
      console.log(err);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err });
    });
};

// exports.deleteComment = (req, res) => {
//     const _id = req.params.id
//     Blog.find({ 'comments._id': _id }).populate('comments.commentUser').then(story => {
//         if(story){
//             const comment = story
//             console.log('1', story)
//             if(comment[0]) {
//                 const cont = comment[0].comments.filter(com => com._id == _id)
//                 Blog.({},
//                     {$pull: {comments: cont[0] }}
//                 ).then(ans => {
//                     console.log(ans)
//                 })
//             } else {
//                 res.status(httpStatus.BAD_REQUEST).json({
//                     status: "error",
//                     data: "No such comment"
//                 });
//             }
//         }
//     }).catch(err => {
//         console.log(err);
//         res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err });
//       });
// }
