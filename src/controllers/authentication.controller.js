const express = require("express");
const debug = require("debug")("backend:controller:authentication");
const validator = require("../middlewares/validator.middleware");
const authenticationModule = require("../modules/authentication.module");

const router = express.Router();

router.post("/register", validator.isValidRequest, async (req, res) => {
  try {
    const payload = req.body;

    const result = await authenticationModule.register(payload, {});

    if (result?.error) {
      return res.status(400).send(result);
    }

    return res.send(result);
  } catch (err) {
    debug(err);
    return res.status(500).send(err);
  }
});

router.post("/login", validator.isValidRequest, async (req, res) => {
  try {
    const payload = req.body;

    const result = await authenticationModule.login(payload, {});

    if (result?.error) {
      return res.status(400).send(result);
    }

    return res.send(result);
  } catch (err) {
    debug(err);
    return res.status(500).send(err);
  }
});

router.post("/app-token", validator.isValidApp, async (req, res) => {
  try {
    const appName = req.header("x-app-name");

    const payload = { name: appName };

    const result = await authenticationModule.createAppToken(payload);

    if (result?.error) {
      return res.status(400).send(result);
    }

    return res.send(result);
  } catch (err) {
    debug(err);
    return res.status(500).send(err);
  }
});

module.exports = router;
