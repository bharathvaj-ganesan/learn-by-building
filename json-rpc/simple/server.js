const express = require("express");
const jsonrpc = require("jsonrpc-lite");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const methods = {
  add: (params) => {
    if (!Array.isArray(params) || params.length !== 2)
      throw jsonrpc.JsonRpcError.invalidParams("Bad params, no sum!");
    return params[0] + params[1];
  },
  greet: (params) => {
    if (!params?.name)
      throw jsonrpc.JsonRpcError.invalidParams("No name, no fame!");
    return `Yo, ${params.name}, what’s good?`;
  },
  notify: (params) => {
    if (!params?.message)
      throw jsonrpc.JsonRpcError.invalidParams("No message to log!");
    console.log(`Notification: ${params?.message}`);
    return null;
  },
  log: (params) => {
    if (!params?.message)
      throw jsonrpc.JsonRpcError.invalidParams("No message to log!");
    console.log(`Notification: ${params.message}`);
    return null;
  },
};

app.post("/rpc", (req, res) => {
  // Parse incoming request with jsonrpc-lite
  const parsed = jsonrpc.parseObject(req.body);
  console.log(parsed);

  // Handle invalid JSON-RPC
  if (parsed.type === "invalid") {
    return res
      .status(400)
      .json(jsonrpc.error(null, jsonrpc.JsonRpcError.invalidRequest()));
  }

  const { type, payload } = parsed;

  // Handle notifications (no ID)
  if (type === "notification") {
    try {
      if (!methods[payload.method]) throw jsonrpc.JsonRpcError.methodNotFound();
      methods[payload.method](payload.params);
      return res.status(204).send();
    } catch (error) {
      return res.status(204).send(); // Silent for notifications
    }
  }

  // Handle requests
  if (type === "request") {
    try {
      if (!methods[payload.method]) throw jsonrpc.JsonRpcError.methodNotFound();
      const result = methods[payload.method](payload.params);
      res.json(jsonrpc.success(payload.id, result));
    } catch (error) {
      res.status(400).json(jsonrpc.error(payload.id, error));
    }
  }
});

app.listen(3000, () =>
  console.log("Server’s JSON-RPC at http://localhost:3000")
);
