import bcryptjs from "bcryptjs";
import { generateJWT } from "../helpers/generate-jwt.js";
import User from "../users/user.js";

export const login = async (req = request, res = response) => {
  const { emailOrUsername, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) {
      return res.status(400).json({
        msg: "Incorrect credentials, email or username doesn't exist in the database.",
      });
    }

    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Incorrect credentials, password doesn't match",
      });
    }

    const token = await generateJWT(user.id);

    res.status(200).json({
      msg: "Welcome ",
      username: user.username,
      token,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      msg: "Contact the manager",
    });
  }
};
