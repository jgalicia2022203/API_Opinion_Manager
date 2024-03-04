import { Router } from "express";
import { check } from "express-validator";
import {
  existsEmail,
  existsPostById,
  existsUsername,
} from "../helpers/db-validators.js";
import { validateFields } from "../middlewares/validate-fields.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import {
  createComment,
  createPost,
  deleteComment,
  deletePost,
  getUserById,
  getUserComments,
  getUserPosts,
  register,
  updateComment,
  updatePassword,
  updatePost,
  updateProfile,
  updateUsername,
} from "../users/user.controller.js";

const router = Router();

router.get("/profile", validateJWT, getUserById);

router.post(
  "/register",
  [
    check("username", "username cannot be empty").not().isEmpty(),
    check("username").custom(existsUsername),
    check("email", "email cannot be empty").not().isEmpty(),
    check("email").custom(existsEmail),
    check("password", "password cannot be empty").not().isEmpty(),
    validateFields,
  ],
  register
);

router.put("/profile", validateJWT, updateProfile);

router.put(
  "/profile/username",
  validateJWT,
  [
    check("currentPassword", "current password is needed").not().isEmpty(),
    check("newUsername", "new username is needed").not().isEmpty(),
    validateFields,
  ],
  updateUsername
);

router.put(
  "/profile/password",
  validateJWT,
  [
    check("currentPassword", "current password is needed").not().isEmpty(),
    check("newPassword", "new password is needed").not().isEmpty(),
    validateFields,
  ],
  updatePassword
);

router.get("/posts", validateJWT, getUserPosts);

router.get("/replies", validateJWT, getUserComments);

router.post(
  "/posts",
  validateJWT,
  [
    check("title", "title cannot be empty").not().isEmpty(),
    check("category", "category cannot be empty").not().isEmpty(),
    check("content", "content cannot be empty").not().isEmpty(),
    validateFields,
  ],
  createPost
);

router.put(
  "/posts/:id",
  validateJWT,
  [
    check("id").custom(existsPostById),
    check("title", "title cannot be empty").not().isEmpty(),
    check("category", "category cannot be empty").not().isEmpty(),
    check("content", "content cannot be empty").not().isEmpty(),
    validateFields,
  ],
  updatePost
);

router.delete("/posts/:id", validateJWT, deletePost);

router.post(
  "/replies/:id",
  validateJWT,
  [check("content", "content cannot be empty").not().isEmpty(), validateFields],
  createComment
);

router.put(
  "/replies/:id",
  validateJWT,
  [check("content", "content cannot be empty").not().isEmpty(), validateFields],
  updateComment
);

router.delete("/replies/:id", validateJWT, deleteComment);

export default router;
