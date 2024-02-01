const express = require("express");
const debug = require("debug")("backend:controller:user");
const userModule = require("../modules/user.module");
const validator = require("../middlewares/validator.middleware");
const { getCurrentUser } = require("../common/helper");

const router = express.Router();

router.get("/", validator.isValidRequest, async (req, res) => {
  try {
    const payload = req.query;
    const user = getCurrentUser(req);

    const result = await userModule.read(payload, user);

    if (result?.error) {
      return res.status(400).send(result);
    }

    return res.send(result);
  } catch (err) {
    debug(err);
    return res.status(500).send(err);
  }
});

router.get("/:id", validator.isValidRequest, async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.query;
    const user = getCurrentUser(req);

    const result = await userModule.readByID(id, payload, user);

    if (result?.error) {
      return res.status(400).send(result);
    }

    return res.send(result);
  } catch (err) {
    debug(err);
    return res.status(500).send(err);
  }
});

router.put("/:id", validator.isValidRequest, async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const user = getCurrentUser(req);

    const result = await userModule.updateByID(id, payload, user);

    if (result?.error) {
      return res.status(400).send(result);
    }

    return res.send(result);
  } catch (err) {
    debug(err);
    return res.status(500).send(err);
  }
});

router.delete("/:id", validator.isValidRequest, async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const user = getCurrentUser(req);

    const result = await userModule.deleteByID(id, payload, user);

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
