export const hasRole = (req, res, next) => {
  if (!req.user) {
    return res.status(500).json({
      msg: `Attempting to validate a user without validating token first`,
    });
  }

  const { role, username } = req.user;

  if (role !== "ADMIN_ROLE") {
    return res.status(401).json({
      msg: `${username} is not an admin and cannot use this endpoint`,
    });
  }
  next();
};
