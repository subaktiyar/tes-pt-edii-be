const Joi = require("joi");
const jwt = require("jsonwebtoken");
const debug = require("debug")("backend:module:authorization");
const encrypt = require("../common/encryptor");

const DB = {
  Authentication: require("../models/authentication.model"),
  Authorization: require("../models/authorization.model"),
  User: require("../models/user.model"),
};

async function readByRole(query, curUser) {
  try {
    debug(query);

    let filter = { is_active: true, role: query?.role };
    let findData = await DB.Authorization.findOne(filter).lean();

    // find default authorization
    if (!findData || findData?.errors) {
      filter = { is_active: true, role: "guest" };
      findData = await DB.Authorization.findOne(filter).lean();

      if (!findData || findData?.errors) {
        return { error: true, message: "Authorization not found" };
      }
    }

    debug(findData, "===> RESULT readByRole");

    return findData?.menu;
  } catch (err) {
    debug(err, "===> ERROR readByRole");
    throw { error: true, message: "Error read authorization" };
  }
}

module.exports = { readByRole };
