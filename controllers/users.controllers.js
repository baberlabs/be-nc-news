const { fetchUsers, fetchUserByUsername } = require("../models/users.models");

const { doesUserExist } = require("../models/utils.models");

exports.getUsers = (request, response, next) => {
  fetchUsers()
    .then((users) => response.status(200).send({ users }))
    .catch(next);
};

exports.getUserByUsername = (request, response, next) => {
  doesUserExist(request.params.username)
    .then((username) => fetchUserByUsername(username))
    .then((user) => response.status(200).send({ user }))
    .catch(next);
};
