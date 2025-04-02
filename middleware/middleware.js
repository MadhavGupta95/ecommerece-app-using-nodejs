import { verifyToken } from "../utils/jwt.js";

export const isAuthorized = (req, res, next) => {
  try {
    const check = req.headers.authorization;
    const isVerified = verifyToken(check);
    if (!isVerified) {
      return res.json({
        message: "Unauthorized",
        success: false,
      });
    }
    req.user = isVerified;
    next();
  } catch (error) {
    console.log(error);
    return res.status({
      message: "Error in middleware",
      success: false,
    });
  }
};
