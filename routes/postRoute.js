const postRoute = require("express").Router();
const postController = require("../controllers/postController");
const { userAuth } = require("../middleware/middleware");

postRoute.get("/", postController.test);
postRoute.post("/addPost", userAuth, postController.addPost);
postRoute.get("/allPosts", userAuth, postController.getAllPosts);
postRoute.get("/post/:post_id", userAuth, postController.getPost);
postRoute.put("/posts/:post_id", userAuth, postController.updatePost);
postRoute.delete("/deletePost/:post_id", userAuth, postController.deletePost);
postRoute.get("/userPosts", userAuth, postController.getUserPosts);
postRoute.delete(
  "/deleteAllPosts",
  userAuth,
  postController.deleteAllUserPosts
);
postRoute.get("/userPosts/:user_id", userAuth, postController.getUserPostsById);
postRoute.put("/likes/:post_id", userAuth, postController.addLike);
postRoute.put("/unLikes/:post_id", userAuth, postController.addUnLike);
postRoute.post("/comments/:post_id", userAuth, postController.addPostComment);
postRoute.delete(
  "/comments/:post_id/:comment_id",
  userAuth,
  postController.deletePostComment
);
postRoute.put(
  "/comments/:post_id/:comment_id",
  userAuth,
  postController.editPostComment
);
module.exports = postRoute;
