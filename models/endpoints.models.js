const endpointData = require("../endpoints.json");

exports.fetchEndpoints = () => {
  return Promise.resolve(endpointData);
};
