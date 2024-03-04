import bcryptjs from "bcryptjs";
import Comment from "../comments/comment.model.js";
import Post from "../posts/post.model.js";
import User from "./user.model.js";

export const getUserById = async (req, res) => {
  const id = req.user.id;
  const user = await User.findOne({ _id: id });

  res.status(200).json({
    user,
  });
};

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ msg: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { userId } = req.user.id;
    const { profile_info } = req.body;

    if (!profile_info || Object.keys(profile_info).length === 0) {
      return res
        .status(400)
        .json({ msg: "Profile info is missing in request body" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { profile_info } },
      { new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const updateUsername = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newUsername } = req.body;

    const user = await User.findById(userId);

    const isPasswordCorrect = await bcryptjs.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ msg: "Incorrect current password" });
    }

    user.username = newUsername;
    await user.save();

    res.status(201).json({ msg: "Username updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    const isPasswordCorrect = await bcryptjs.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ msg: "Incorrect current password" });
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ msg: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getUserPosts = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate({
      path: "posts",
      match: { status: true },
    });

    const filteredPosts = user.posts.filter((post) => post.status === true);

    res.status(200).json({
      posts: filteredPosts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getUserComments = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate({
      path: "comments",
      match: { status: true },
    });

    const filteredComments = user.comments.filter(
      (comment) => comment.status === true
    );

    res.status(200).json({
      comments: filteredComments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const createPost = async (req, res) => {
  const { title, category, content } = req.body;
  const author = req.user.id;

  try {
    const post = new Post({
      author,
      title,
      category,
      content,
    });
    await post.save();

    await User.findByIdAndUpdate(
      author,
      { $push: { posts: post._id } },
      { new: true }
    );

    res.status(201).json({ msg: "Post created successfully", post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const updatePost = async (req, res) => {
  const postId = req.params.id;
  const { title, category, content } = req.body;
  const userId = req.user.id;

  try {
    const existingPost = await Post.findById(postId);
    if (existingPost.author.toString() !== userId) {
      return res
        .status(403)
        .json({ msg: "You are not allowed to edit this post" });
    }

    existingPost.title = title;
    existingPost.category = category;
    existingPost.content = content;

    await existingPost.save();

    res.json({ msg: "Post updated successfully", post: existingPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const deletePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  try {
    const existingPost = await Post.findById(postId);

    if (!existingPost) {
      return res.status(404).json({ msg: "Post not found" });
    }

    if (existingPost.author.toString() !== userId) {
      return res
        .status(403)
        .json({ msg: "You are not allowed to delete this post" });
    }

    existingPost.status = false;
    await existingPost.save();
    await User.findByIdAndUpdate(userId, { $pull: { posts: postId } });

    res.json({ msg: "Post deleted successfully", post: existingPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const createComment = async (req, res) => {
  const author = req.user.id;
  const post = req.params.id;
  const { content } = req.body;

  try {
    const comment = new Comment({
      author,
      post,
      content,
    });
    await comment.save();

    await User.findByIdAndUpdate(
      author,
      { $push: { comments: comment._id } },
      { new: true }
    );

    await Post.findByIdAndUpdate(
      post,
      { $push: { comments: comment._id } },
      { new: true }
    );

    res.status(201).json({ msg: "Comment published successfully", comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const updateComment = async (req, res) => {
  const author = req.user.id;
  const commentId = req.params.id;
  const { content } = req.body;

  try {
    const existingComment = await Comment.findById(commentId);
    if (existingComment.author.toString() !== author) {
      return res
        .status(403)
        .json({ msg: "You are not allowed to edit this comment" });
    }

    existingComment.content = content;

    await existingComment.save();

    res
      .status(201)
      .json({ msg: "Comment updated successfully", comment: existingComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const deleteComment = async (req, res) => {
  const commentId = req.params.id;
  const userId = req.user.id;

  try {
    const existingComment = await Comment.findById(commentId);

    if (!existingComment) {
      return res.status(404).json({ msg: "Comment not found" });
    }

    if (existingComment.author.toString() !== userId) {
      return res
        .status(403)
        .json({ msg: "You are not allowed to delete this comment" });
    }

    existingComment.status = false;
    await existingComment.save();

    const postId = existingComment.post;

    await Post.findByIdAndUpdate(postId, { $pull: { comments: commentId } });

    await User.findByIdAndUpdate(postId, { $pull: { comments: commentId } });

    res.status(201).json({
      msg: "Comment deleted successfully",
      comments: existingComment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
