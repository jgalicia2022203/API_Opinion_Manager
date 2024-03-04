import { Router } from "express";
import { check } from "express-validator";
import {
  existEmail_Login,
  existsUsername_Login,
} from "../helpers/db-validators.js";
import { validateFields } from "../middlewares/validate-fields.js";
import { login } from "./auth.controller.js";

const router = Router();

router.post(
  "/login",
  [
    check("emailOrUsername", "username or email is needed").not().isEmpty(),
    check("emailOrUsername", "Please enter a valid email or username").custom(
      async (value) => {
        return (
          (await existEmail_Login(value)) || (await existsUsername_Login(value))
        );
      }
    ),
    check("password", "The password is obligatory").not().isEmpty(),
    validateFields,
  ],
  login
);

export default router;
