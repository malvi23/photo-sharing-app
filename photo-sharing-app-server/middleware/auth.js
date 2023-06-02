const jwt = require("jsonwebtoken");
const apiResponse = require("./apiResponseMiddleware");
const { environment } = require("../env");

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return apiResponse.forbidden(res, {
      message: "A token is required for authentication",
    });
  }
  try {
    const decoded = jwt.verify(token, environment.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return apiResponse.unauthorized(res, { message: "Invalid Token" });
  }
  return next();
};

module.exports = verifyToken;
