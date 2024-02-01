require("dotenv").config();
const server = require("./server");
const debug = require("debug")("backend:server");
const pjs = require("../package.json");

app = server.listen(process.env.PORT || 0, () => {
  debug(
    `${pjs.name} v${pjs.version} listening on ${app.address().address}:${
      app.address().port
    }`
  );
});
