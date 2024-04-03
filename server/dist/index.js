"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const chalk_1 = __importDefault(require("chalk"));
const apiTracker_1 = __importDefault(require("./middle ware/apiTracker"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use(apiTracker_1.default);
const port = process.env.API_PORT;
const public_url = process.env.PUBLIC_URL;
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
    },
});
io.on("connection", (socket) => {
    const userAuth = socket.handshake.auth.userInfo;
    console.log("New socket connected ", socket.id, "with", userAuth);
    if (userAuth.role !== "ADMIN") {
        socket.join(`admin${userAuth.id}`);
    }
    else {
        socket.join("admin");
    }
    socket.on("message", (messageData) => {
        if (messageData.receiverId) {
            socket.to(`admin${messageData.receiverId}`).emit("receive-message", messageData);
            return;
        }
        else {
            socket.to("admin").emit("receive-message", messageData);
            return;
        }
    });
    socket.on("disconnect", (reason, description) => {
        console.log(reason);
    });
});
app.get("/", (req, res) => {
    res.status(200).send("hello!");
});
// app.get("*", (_, res) => {
// 	res.status(404).send("not found");
// });
server.listen(port, () => {
    console.log(chalk_1.default.yellow.bold("Server ") +
        chalk_1.default.bold.green("is running ") +
        chalk_1.default.blue.bold(`at ${public_url}:${port}`));
});
