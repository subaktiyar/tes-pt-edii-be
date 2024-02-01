const express = require("express");
const debug = require("debug")("backend:controller:authorization");
const validator = require("../middlewares/validator.middleware");
const authorizationModule = require("../modules/authorization.module");

const router = express.Router();

router.get("/:role", validator.isValidRequest, async (req, res) => {
  try {
    const payload = req.query;
    payload.role = req.params.role;

    const result = await authorizationModule.readByRole(payload);

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
