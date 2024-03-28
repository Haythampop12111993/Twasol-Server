const postModel = require("../db/models/PostModel");
const profileModel = require("../db/models/ProfileModel");
const { resGenerator } = require("../helper/resGenerator");
class postController {
  static test = (req, res) => {
    res.send("hello from post controller");
  };
  static addPost = async (req, res) => {
    const userProfile = await profileModel.findOne({ user: req.user._id });
    if (!userProfile) {
      return resGenerator(
        res,
        404,
        false,
        "User profile not found please create one",
        null
      );
    }
    try {
      const userPost = new postModel({
        ...req.body,
        user: req.user._id,
        name: req.user.name,
        userPostImg: userProfile.image,
      });
      await userPost.save();
      return resGenerator(res, 200, true, "Post added successfully", userPost);
    } catch (e) {
      return resGenerator(res, 500, false, e.message, null);
    }
  };
  static getAllPosts = async (req, res) => {
    try {
      const posts = await postModel.find().sort({ createdAt: -1 });
      if (!posts || !posts.length)
        return resGenerator(res, 404, true, "No Posts", null);
      return resGenerator(res, 200, true, "Posts", posts);
    } catch (e) {
      return resGenerator(res, 500, false, e.message, null);
    }
  };
  static deletePost = async (req, res) => {
    try {
      const isUserPost = await postModel.findOne({
        user: req.user._id,
        _id: req.params.post_id,
      });
      if (!isUserPost)
        return resGenerator(
          res,
          401,
          false,
          "You are not authorized to delete this post",
          null
        );
      const findPost = await postModel.findById(req.params.post_id);
      if (!findPost)
        return resGenerator(res, 404, false, "Post Not Found", null);

      const post = await postModel.findByIdAndDelete(req.params.post_id);
      return resGenerator(res, 200, true, "Post deleted successfully", post);
    } catch (e) {
      return resGenerator(res, 500, false, e.message, null);
    }
  };
  static getPost = async (req, res) => {
    try {
      const post = await postModel.findOne({
        _id: req.params.post_id,
      });
      if (!post) return resGenerator(res, 404, false, "Post Not Found", null);
      return resGenerator(res, 200, true, "Post", post);
    } catch (e) {
      return resGenerator(res, 500, false, e.message, null);
    }
  };
  static getUserPosts = async (req, res) => {
    try {
      const userPosts = await postModel.find({ user: req.user._id });
      if (!userPosts || !userPosts.length)
        return resGenerator(res, 404, true, "No Posts", null);
      return resGenerator(res, 200, true, "Posts", userPosts);
    } catch (e) {
      return resGenerator(res, 500, false, e.message, null);
    }
  };
  static deleteAllUserPosts = async (req, res) => {
    try {
      const userPosts = await postModel.deleteMany({ user: req.user._id });
      if (!userPosts.deletedCount)
        return resGenerator(res, 404, false, "No Posts", null);
      return resGenerator(res, 200, true, "Deleted all posts", userPosts);
    } catch (e) {
      return resGenerator(res, 500, false, e.message, null);
    }
  };
  static getUserPostsById = async (req, res) => {
    try {
      const userPosts = await postModel.find({ user: req.params.user_id });
      if (!userPosts || !userPosts.length)
        return resGenerator(res, 404, true, "No Posts", null);
      return resGenerator(res, 200, true, "Posts", userPosts);
    } catch (e) {
      resGenerator(res, 500, false, e.message, null);
    }
  };
  static updatePost = async (req, res) => {
    try {
      const post = await postModel.findOne({ _id: req.params.post_id });
      if (!post) return resGenerator(res, 404, false, "Post not found", null);
      const updatedPost = await postModel.findOneAndUpdate(
        { _id: req.params.post_id },
        req.body,
        { new: true }
      );
      return resGenerator(
        res,
        200,
        true,
        "Post updated successfully",
        updatedPost
      );
    } catch (e) {
      resGenerator(res, 500, false, e.message, null);
    }
  };
  static addLike = async (req, res) => {
    try {
      const post = await postModel.findOne({ _id: req.params.post_id });
      //   res.send(post);
      if (!post) return resGenerator(res, 404, false, "Post not found", null);
      let isUserLiked = false;
      let isUserUnLiked = false;
      // if(post.likes.filter(like => like.user.toString() === req.user._id.toString()).length > 0) {
      //     return resGenerator(res, 400, false, "Post already liked", null);
      // }
      //   const isUserLiks = post.likes.every(
      //     (like) => like.user.toString() !== req.user._id.toString()
      //   );
      //   const isUserLiks = post.likes.some(
      //     (like) => like.user.toString() == req.user._id.toString()
      //   );
      post.unLikes.map((unlike) => {
        if (unlike.user.toString() == req.user._id.toString()) {
          isUserUnLiked = true;
        }
      });
      if (isUserUnLiked)
        post.unLikes = post.unLikes.filter(
          (unlike) => unlike.user.toString() !== req.user._id.toString()
        );
      ///////////////////////////////////////////////////////////////////
      post.likes.map((like) => {
        if (like.user.toString() == req.user._id.toString()) {
          isUserLiked = true;
        }
      });
      if (isUserLiked)
        return resGenerator(res, 400, false, "Post already liked", null);
      post.likes.unshift({ user: req.user._id });
      await post.save();
      return resGenerator(res, 201, true, "Liked the post", post);
    } catch (e) {
      return resGenerator(res, 500, false, e.message, null);
    }
  };
  static addUnLike = async (req, res) => {
    try {
      let isPostLiked = false;
      let isPostUnLiked = false;
      const post = await postModel.findOne({ _id: req.params.post_id });
      post.likes.map((like) => {
        if (like.user.toString() == req.user._id.toString()) {
          isPostLiked = true;
        }
      });
      if (isPostLiked)
        post.likes = post.likes.filter((like) => {
          return like.user.toString() !== req.user._id.toString();
        });
      //   const isPostUnLiked = post.unLikes.every(
      //     (unLike) => unLike.user.toString() == req.user._id.toString()
      //   );
      //   res.send(isPostLiked);
      //   res.send(newPostsLikes);
      post.unLikes.map((unLike) => {
        if (unLike.user.toString() == req.user._id.toString()) {
          isPostUnLiked = true;
        }
      });
      if (isPostUnLiked)
        return resGenerator(res, 400, false, "Post already unliked", null);
      post.unLikes.unshift({ user: req.user._id });
      await post.save();
      return resGenerator(res, 201, true, "Unliked the post", post);
    } catch (e) {
      return resGenerator(res, 500, false, e.message, null);
    }
  };
  static addPostComment = async (req, res) => {
    try {
      const post = await postModel.findOne({ _id: req.params.post_id });
      if (!post) return resGenerator(res, 404, false, "Post not found", null);
      const userProfile = await profileModel.findOne({ user: req.user._id });
      if (!userProfile)
        return resGenerator(res, 404, false, "Profile not found", null);
      post.comments.unshift({
        user: req.user._id,
        text: req.body.text,
        name: req.user.name,
        image: userProfile.image,
      });
      await post.save();
      return resGenerator(res, 201, true, "Comment added", post);
    } catch (e) {
      return resGenerator(res, 500, false, e.message, null);
    }
  };
  static deletePostComment = async (req, res) => {
    try {
      const post = await postModel.findOne({ _id: req.params.post_id });
      if (!post) return resGenerator(res, 404, false, "Post not found", null);
      const postComment = await postModel.findOne({
        _id: req.params.post_id,
        "comments._id": req.params.comment_id,
      });
      if (!postComment)
        return resGenerator(res, 404, false, "Comment not found", null);
      post.comments = post.comments.filter((comment) => {
        return comment._id.toString() !== req.params.comment_id;
      });
      await post.save();
      return resGenerator(res, 200, true, "Deleted Comment", post);
    } catch (e) {
      return resGenerator(res, 500, false, e.message, null);
    }
  };
  static editPostComment = async (req, res) => {
    try {
      const post = await postModel.findOne({ _id: req.params.post_id });
      if (!post) return resGenerator(res, 404, false, "Post not found", null);
      const postComment = await postModel.findOne({
        _id: req.params.post_id,
        "comments._id": req.params.comment_id,
      });
      if (!postComment)
        return resGenerator(res, 404, false, "Comment not found", null);
      //   res.send(postComment);
      post.comments.map((comment) => {
        if (comment._id.toString() == req.params.comment_id) {
          comment.text = req.body.text;
          comment.update = Date.now();
        }
      });
      await post.save();
      return resGenerator(res, 200, true, "Edited Comment", post);
    } catch (e) {
      resGenerator(res, 500, false, e.massage, null);
    }
  };
}
module.exports = postController;
