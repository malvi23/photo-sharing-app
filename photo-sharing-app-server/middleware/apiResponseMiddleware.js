// todo: add proper api respose format
// Middleware for handling API responses
successResponse = (data, message) => {
  return {
    code: 1,
    status: "success",
    message: message,
    data: data,
  };
};

errorResponse = (message) => {
  return {
    code: 0,
    status: "failure",
    message: message,
    data: {},
  };
};

success = (res, data) => {
  res.status(200).json(successResponse(data.data, data.message));
};

created = (res, data) => {
  res.status(201).json(successResponse(data.data, data.message));
};

noContent = (res, data) => {
  res.status(204).json(successResponse(data.data, data.message));
};

badRequest = (res, error) => {
  res.status(400).json(errorResponse(error.message || "Bad Request"));
};

unauthorized = (res, error) => {
  res.status(401).json(errorResponse(error.message || "Unauthorized"));
};

alreadyExist = (res, error) => {
  res.status(409).json(errorResponse(error.message || "Already Exist"));
};

forbidden = (res, error) => {
  res.status(403).json(errorResponse(error.message || "Forbidden"));
};

unsupportedMediaType = (res, error) => {
  res
    .status(415)
    .json(
      errorResponse(
        error.message ||
          "Incorrect content type is provided as part of the request"
      )
    );
};

internalServerError = (res, error) => {
  res.status(500).json(errorResponse(error.message || "Internal server error"));
};

module.exports = {
  success,
  created,
  noContent,
  badRequest,
  unauthorized,
  alreadyExist,
  forbidden,
  unsupportedMediaType,
  internalServerError,
};
