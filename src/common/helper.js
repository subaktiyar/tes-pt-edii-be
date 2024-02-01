const jwt_decode = require("jwt-decode");

function isEmptyObject(obj) {
  return obj == null || !Object.keys(obj).length;
}

function isEmptyArray(arr) {
  return arr == null || !arr.length;
}

function getCurrentUser(req) {
  const userToken = req.header("x-user-token");
  const decode = jwt_decode.jwtDecode(userToken);
  return decode;
}

module.exports = { isEmptyArray, isEmptyObject, getCurrentUser };
