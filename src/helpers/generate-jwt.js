import jwt from "jsonwebtoken";

export const generateJWT = (uid = "") => {
  return new Promise((resolve, reject) => {
    const payload = { uid };
    jwt.sign(
      payload,
      process.env.SECRET_OR_PRIVATE_KEY,
      {
        expiresIn: "1h",
      },
      (err, token) => {
        err
          ? (console.log(err), reject("Unable to generate token"))
          : resolve(token);
      }
    );
  });
};
