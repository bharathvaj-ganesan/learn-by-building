const express = require("express");
const bodyParser = require("body-parser");
const jsonrpc = require("jsonrpc-lite");

const app = express();
app.use(bodyParser.json());

const methods = {
  subtract: ([a, b]) => a - b,
  greet: ([name]) => `Hello, ${name}!`,
};

app.post("/rpc", (req, res) => {
  const parsed = jsonrpc.parseObject(req.body);
  console.log(parsed);
  const { id, method, params } = parsed.payload;
  if (parsed.type === "request") {
    if (methods[method]) {
      const result = methods[method](params);
      res.json(jsonrpc.success(id, result));
    } else {
      res.json(jsonrpc.error(id, jsonrpc.JsonRpcError.methodNotFound()));
    }
  } else if (parsed.type === "notification") {
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

app.listen(3000, () =>
  console.log("JSON-RPC server on http://localhost:3000/rpc")
);
