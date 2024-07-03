const http = require("http");

const server = http.createServer((req, res) => {
  let rawBody = "";

  req.on("data", (chunk) => {
    rawBody += chunk.toString();
  });

  req.on("end", () => {
    console.log("Incoming Raw Body:", rawBody);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ received: rawBody }));
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Simple server running on http://localhost:${PORT}`);
});
