import express from "express";
import { createServer } from "http";
import { DisconnectReason, Server } from "socket.io";
import cors from "cors";

import bodyParser from "body-parser";
import dotenv from "dotenv";
import chalk from "chalk";
import apiTracker from "./middle ware/apiTracker";
import { Message } from "./type/Message";

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(apiTracker);

const port = process.env.API_PORT;
const public_url = process.env.PUBLIC_URL;
const webapp_url = process.env.WEBAPP_URL;

const server = createServer(app);

const io = new Server(server, {
	cors: {
		origin: ["http://localhost:5173", `${webapp_url}`],
		methods: ["GET", "POST"],
	},
});

type UserInfo = {
	email: string;
	id: string;
	username: string;
	displayname: string;
	role: string;
};

io.on("connection", (socket) => {
	const userAuth: UserInfo = socket.handshake.auth.userInfo;

	console.log("New socket connected", socket.id, "with username", userAuth.username);

	socket.on("message", (msg: Message) => {
		console.log("receive from", msg);

		io.to(msg.receiver).emit("receive-message", msg);
	});

	socket.on("request-admin", () => {
		
		io.to(socket.id).emit("assign-admin");
	});

	socket.on("join", (rooms: string[]) => {
		socket.join(rooms);
	});

	socket.on("disconnect", (reason: DisconnectReason, _description) => {
		console.log(reason);
	});
});

app.get("/", (_req, res) => {
	res.status(200).send("hello!");
});
app.get("*", (_, res) => {
	res.status(404).send("not found");
});

server.listen(port, () => {
	console.log(
		chalk.yellow.bold("Server ") +
			chalk.bold.green("is running ") +
			chalk.blue.bold(`at ${public_url}:${port}`)
	);
});
