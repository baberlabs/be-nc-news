exports.invalidAPIHandler = (request, response, next) => {
  response.status(404).send({ message: "API Not Found" });
};

exports.customErrorsHandler = (error, request, response, next) => {
  if (error.status && error.message) {
    response.status(error.status).send({ message: error.message });
  }
  next(error);
};

exports.databaseErrorsHandler = (error, request, response, next) => {
  switch (error.code) {
    case "22P02":
    case "23502":
      response.status(400).send({ message: "Bad Request" });
      break;
    case "23503":
      response.status(404).send({ message: "User Not Found" });
      break;
    default:
      next(error);
  }
};

exports.serverErrorsHandler = (error, request, response, next) => {
  response.status(500).send({ message: "Internal Server Error" });
};
