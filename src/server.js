import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Put all your backend code here.

const sockets = [];

const handleConnection = (socket) => {
  sockets.push(socket);
  socket["nickname"] = "익명";
  console.log("Connected to Browser ✅");
  socket.on("close", () => console.log("Disconnected from the Browser ❌"));
  socket.on("message", (msg) => {
    const message = JSON.parse(msg);
    switch (message.type){
      case "message":
        sockets.forEach(aSocket => {
          aSocket.send(`${socket["nickname"]}: ${message.payload.toString('utf8')}`);
        });
        break;
      case "nickname":
        socket["nickname"] = message.payload.toString('utf8');
        break;
    }
  });
};

wss.on("connection", handleConnection);

server.listen(3000, handleListen);
