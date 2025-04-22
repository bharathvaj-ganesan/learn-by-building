const jsonrpc = require("jsonrpc-lite");

const requestPayload = jsonrpc.request(1, "greet", ["Bharath"]);

const notificationPayload = jsonrpc.notification("notify", {
  message: "New package published to AWS CodeArtifact",
});

// Sending request
fetch("http://localhost:3000/rpc", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(requestPayload),
})
  .then((res) => res.json())
  .then(console.log);

// Sending notification
fetch("http://localhost:3000/rpc", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(notificationPayload),
})
  .then((res) => res.text())
  .then(console.log);
