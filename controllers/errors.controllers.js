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
  const errorCodes = ["22P02"];
  if (errorCodes.includes(error.code)) {
    response.status(400).send({ message: "Bad Request" });
  }
  next(error);
};

exports.serverErrorsHandler = (error, request, response, next) => {
  response.status(500).send({ message: "Internal Server Error" });
};
