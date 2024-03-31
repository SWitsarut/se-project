import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

import bodyParser from "body-parser";
import dotenv from "dotenv";
import chalk from "chalk";
import apiTracker from "./middle ware/apiTracker";
import { sendingMSG } from "./type/Message";

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
		origin: ["*", "*:*", `${webapp_url}`],
		methods: ["*"],
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
	const userAuth: UserInfo = socket.handshake.auth.userinfo;

	console.log("New socket connected", socket.id, "with ", userAuth);

	socket.on("message", async (msg: string) => {
		console.log("receive from", msg);
		const msgContent: sendingMSG = await JSON.parse(msg);
		// console.log("to json", msg);
		const saved = await fetch(`${webapp_url}/api/chat/newmsg`, {
			method: "POST",
			body: JSON.stringify(msgContent),
		}).then((e) => e.json());
		// console.log("saved", saved);
		io.to(socket.id).emit("sended", JSON.stringify({ id: saved.id, msg: saved.message }));
		io.to(saved.to.sessionId).emit("receive-message", saved.message);
		// io.to(saved.to.sessionId).emit("notify-message", saved.message);
	});

	// socket.on("disconnect", async (reason: DisconnectReason, _description) => {
	// 	console.log(socket.id, reason);
	// 	await fetch(`${webapp_url}/api/chat/endSession`, {
	// 		method: "POST",
	// 		body: JSON.stringify({ id: socket.id }),
	// 	})
	// 		.then((e) => e.json())
	// 		.then((js) => console.log("user disconnected", js, reason));
	// });
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
