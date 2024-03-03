import Comment from "../comments/comment.js";
import Post from "../posts/post.js";
import Role from "../role/role.js";
import User from "../users/user.js";

export const validRole = async (role = "") => {
  const existsRole = await Role.findOne({ role });
  if (!existsRole) {
    throw new Error(`role ${role} doesn't exist in database`);
  }
};

export const existsEmail = async (email = "") => {
  const existsEmail = await User.findOne({ email });
  if (existsEmail) {
    throw new Error(`the email ${email} is already registered`);
  }
};

export const existsUserById = async (id = "") => {
  const existsUser = await User.findOne({ id });
  if (existsUser) {
    throw new Error(`the user with the id ${id} doesn't exist`);
  }
};

export const existsPostById = async (id = "") => {
  const existsPost = await Post.findOne({ id });
  if (existsPost) {
    throw new Error(`the post with the id ${id} doesn't exist`);
  }
};

export const existsCommentById = async (id = "") => {
  const existsComment = await Comment.findOne({ id });
  if (existsComment) {
    throw new Error(`the comment with the id ${id} doesn't exist`);
  }
};
