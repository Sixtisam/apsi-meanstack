const postmodel = require("../models/post");
const express = require("express");

const checkAuth = require("../middleware/check-auth");
const router = express.Router();

router.post("/", checkAuth, (req, res, next) => {
  const post = new postmodel({
    title: req.body.title,
    content: req.body.content,
    creator: req.userData.userId,
  });
  post.save().then(
    (result) => {
      res.status(201).json({
        message: "Post added successfully",
        postId: result._id,
      });
    },
    (e) => console.error(e)
  );
});

router.put("/:id", checkAuth, (req, res, next) => {
  const post = new postmodel({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    creator: req.userData.userId
  });
  postmodel
    .updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then((result) => {
      if (result.nModified > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not Authorized!" });
      }
    });
});

router.get("/", (req, res, next) => {
  postmodel.find().then((documents) => {
    res.status(200).json({
      message: "Posts Fetched Successfully",
      posts: documents,
    });
  });
});

router.get("/:id", (req, res, next) => {
  postmodel.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(484).json({ message: "Post not Found!" });
    }
  });
});

router.delete("/:id", checkAuth, (req, res, next) => {
  postmodel
    .deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({ message: "Delete successful!" });
      } else {
        res.status(401).json({ message: "Not Authorized!" });
      }
    });
});

module.exports = router;
