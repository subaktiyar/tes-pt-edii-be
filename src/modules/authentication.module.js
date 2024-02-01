const Joi = require("joi");
const jwt = require("jsonwebtoken");
const debug = require("debug")("backend:module:authentication");
const encrypt = require("../common/encryptor");

const DB = {
  Authentication: require("../models/authentication.model"),
  Authorization: require("../models/authorization.model"),
  User: require("../models/user.model"),
};

const registerSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const loginSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

function validateRegisterSchema(schema) {
  return registerSchema.validate(schema);
}

function validateLoginSchema(schema) {
  return loginSchema.validate(schema);
}

async function register(payload, curUser) {
  try {
    debug(payload, "===> PAYLOAD register");

    const validate = validateRegisterSchema(payload);
    if (validate.error) {
      debug(validate.error.message, "===> ERROR VALIDATION");
      return { error: true, message: validate.error.details[0].message };
    }

    const new_password = await encrypt.hash(payload.password);

    const new_value = {
      ...payload,
      password: new_password,
      created_at: new Date(),
      created_by: payload.email,
      updated_at: new Date(),
      updated_by: payload.email,
    };

    const result = await new DB.Authentication(new_value).save();

    if (result && !result?.errors) {
      const new_user = {
        email: payload.email,
        created_at: new Date(),
        created_by: payload.email,
        updated_at: new Date(),
        updated_by: payload.email,
      };

      await new DB.User(new_user).save();
    }

    return result;
  } catch (err) {
    debug(err, "===> ERROR register");
    throw { error: true, message: "Register Failed" };
  }
}

async function login(payload, curUser) {
  try {
    debug(payload, "===> PAYLOAD login");

    const validate = validateLoginSchema(payload);
    if (validate.error) {
      debug(validate.error.message, "===> ERROR VALIDATION");
      return { error: true, message: validate.error.details[0].message };
    }

    const findAuth = await DB.Authentication.findOne({
      email: payload.email,
      is_active: true,
    });

    if (!findAuth || findAuth?.errors) {
      return {
        error: true,
        message: "Email is not registered yet. Please contact Admin!",
      };
    }

    // check password
    const isValid = await encrypt.verify(payload.password, findAuth.password);

    if (!isValid) {
      return { error: true, message: "Invalid password" };
    }

    // find biodata user
    const filterBiodata = { is_active: true, email: payload.email };
    let findBiodata = await DB.User.findOne(filterBiodata).lean();

    if (!findBiodata || findBiodata?.errors) {
      findBiodata = {};
    }

    // create accessToken
    const token = jwt.sign(
      {
        role: findAuth.role,
        type: "user",
        biodata: findBiodata,
      },
      process.env.PRIVATE_KEY,
      { expiresIn: String(process.env.SESSION_TIME) }
    );

    return { accessToken: token };
  } catch (err) {
    debug(err, "===> ERROR login");
    throw { error: true, message: "Login Failed" };
  }
}

async function createAppToken(payload) {
  try {
    debug(payload, "==> createAppToken");
    const token = jwt.sign(
      { name: payload.name, type: "public" },
      process.env.PRIVATE_KEY,
      { expiresIn: String(process.env.SESSION_TIME) }
    );
    return { appToken: token };
  } catch (err) {
    debug(err, "===> ERROR createAppToken");
    throw { error: true, message: "Create App Token Failed" };
  }
}

module.exports = { register, login, createAppToken };
