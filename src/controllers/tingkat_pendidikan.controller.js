const express = require("express");
const debug = require("debug")("backend:controller:tingkat-pendidikan");
const tingkatPendidikanModule = require("../modules/tingkat_pendidikan.module");
const validator = require("../middlewares/validator.middleware");
const { getCurrentUser } = require("../common/helper");

const router = express.Router();

router.get("/", validator.isValidRequest, async (req, res) => {
  try {
    const payload = req.query;
    const user = getCurrentUser(req);

    const result = await tingkatPendidikanModule.read(payload, user);

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
