// todo: add proper api respose format
// Middleware for handling API responses
success = (res, data) => {
  res.status(200).json(data);
};

created = (res, data) => {
  res.status(201).json(data);
};

noContent = (res, data) => {
  res.status(204).json(data);
};

badRequest = (res, error) => {
  res.status(400).json({ error: error.message || "Bad Request" });
};

unauthorized = (res, error) => {
  res.status(401).json({ error: error.message || "Unauthorized" });
};

alreadyExist = (res, error) => {
  res.status(409).json({ error: error.message || "Already Exist" });
};

forbidden = (res, error) => {
  res.status(403).json({ error: error.message || "Forbidden" });
};

unsupportedMediaType = (res, error) => {
  res.status(415).json({
    error:
      error.message ||
      "Incorrect content type is provided as part of the request",
  });
};

internalServerError = (res, error) => {
  res.status(500).json({ error: error.message || "Internal server error" });
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
