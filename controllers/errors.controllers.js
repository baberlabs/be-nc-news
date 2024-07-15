exports.invalidAPIHandler = (request, response, next) => {
  response.status(404).send({ message: "API Not Found" });
};

exports.serverErrorsHandler = (error, request, response, next) => {
  response.status(500).send({ message: "Internal Server Error" });
};
