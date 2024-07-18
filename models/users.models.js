const db = require("../db/connection");

exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows: users }) => users);
};

exports.fetchUserByUsername = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(({ rows: users }) => users[0]);
};
