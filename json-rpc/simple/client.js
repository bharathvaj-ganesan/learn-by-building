const jsonrpc = require("jsonrpc-lite");

async function sendRpcRequest(body, skipResponse = false) {
  const res = await fetch("http://localhost:3000/rpc", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (skipResponse) {
    return res.status;
  }
  return await res.json();
}

async function test() {
  console.log("add([5, 3]):", await sendRpcRequest(jsonrpc.request(1, "add", [5, 3])));
  console.log("greet({ name: 'Alice' }):", await sendRpcRequest(jsonrpc.request(2, "greet", { name: "Alice" })));
  console.log("notification:", await sendRpcRequest(jsonrpc.notification("notify", {
    message: "Hello"
  }), true));
  console.log("bogus method:", await sendRpcRequest(jsonrpc.request(3, "not-a-method", [5, 3])));
}

test();