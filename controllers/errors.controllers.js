exports.serverErrorsHandler = (error, request, response, next) => {
  response.status(500).send({ message: "Internal Server Error" });
};
