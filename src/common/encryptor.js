const bcrypt = require("bcryptjs");

async function hash(password) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(12, function (err, salt) {
      bcrypt.hash(password, salt, function (err, hash) {
        if (err) reject(err);
        resolve(hash);
      });
    });
  });
}

async function verify(password, hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, function (err, res) {
      if (err) reject(err);
      resolve(res);
    });
  });
}

module.exports = { hash, verify };
