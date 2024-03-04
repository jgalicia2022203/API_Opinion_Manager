import Comment from "../comments/comment.model.js";
import Post from "../posts/post.model.js";
import Role from "../role/role.js";
import User from "../users/user.model.js";

export const validRole = async (role = "") => {
  const existsRole = await Role.findOne({ role });
  if (!existsRole) {
    throw new Error(`role ${role} doesn't exist in database`);
  }
};

export const existsUsername_Login = async (username = "") => {
  const existingUsername = await User.findOne({ username });
  return !!existingUsername;
};

export const existEmail_Login = async (email = "") => {
  const existingEmail = await User.findOne({ email });
  return !!existingEmail;
};

export const existsUsername = async (username = "") => {
  const existsUsername = await User.findOne({ username });
  if (existsUsername) {
    throw new Error(`the username ${username} is already registered`);
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
