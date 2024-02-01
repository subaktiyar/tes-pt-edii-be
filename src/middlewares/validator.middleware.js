const debug = require("debug")("backend:server");
const jwt = require("jsonwebtoken");
const util = require("util");

const jwtVerify = util.promisify(jwt.verify);

async function isValidApp(req, res, next) {
  try {
    debug("===> isValidApp");
    const appName = req.header("x-app-name");
    const publicKey = req.header("x-public-key");

    if (!appName)
      return res.status(401).send({ error: true, message: "Access Denied" });
    if (appName != process.env.NAME)
      return res.status(401).send({ error: true, message: "Access Denied" });
    if (publicKey != process.env.PUBLIC_KEY)
      return res.status(401).send({ error: true, message: "Access Denied" });

    next();
  } catch (err) {
    debug(err, "===> ERROR isValidApp");
    return res
      .status(500)
      .send({ error: true, message: "Internal Server Error" });
  }
}

async function isValidRequest(req, res, next) {
  try {
    debug("===> isValidRequest");
    const appToken = req.header("x-application-token");

    if (!appToken)
      return res.status(401).send({ error: true, message: "Access Denied" });

    const appTokens = appToken.split(" ");

    if (appTokens?.length < 2)
      return res.status(401).send({ error: true, message: "Access Denied" });

    const token = appTokens[1];
    const verifyToken = jwt.verify(token, process.env.PRIVATE_KEY);

    if (verifyToken?.name != process.env.NAME)
      return res.status(401).send({ error: true, message: "Access Denied" });

    let url = req.originalUrl.replace("/api/", "");

    // exclude auth
    if (!url?.includes("auth")) {
      const userToken = req.header("x-user-token");

      if (!userToken)
        return res
          .status(401)
          .send({ error: true, message: "Please login first" });

      const userTokens = userToken.split(" ");

      if (userTokens?.length < 2)
        return res
          .status(401)
          .send({ error: true, message: "Please login first" });

      const token = userTokens[1];
      const checkUserToken = await jwtVerify(token, process.env.PRIVATE_KEY);

      if (!checkUserToken)
        return res.status(401).send({ error: true, message: "Access Denied" });
    }

    return next();
  } catch (err) {
    debug(err, "===> ERROR isValidRequest");
    return res
      .status(500)
      .send({ error: true, message: "Internal Server Error" });
  }
}

module.exports = { isValidApp, isValidRequest };
