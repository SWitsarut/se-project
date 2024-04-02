import express from "express";
import { createServer } from "http";
import { DisconnectReason, Server } from "socket.io";
import cors from "cors";

import bodyParser from "body-parser";
import dotenv from "dotenv";
import chalk from "chalk";
import apiTracker from "./middle ware/apiTracker";
import { MessageData, UserInfo } from "./type/Message";

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(apiTracker);

const port = process.env.API_PORT;
const public_url = process.env.PUBLIC_URL;
// const webapp_url = process.env.WEBAPP_URL;

const server = createServer(app);

const io = new Server(server, {
	cors: {
		origin: "*",
	},
});

io.on("connection", (socket) => {
	const userAuth: UserInfo = socket.handshake.auth.userInfo;

	console.log("New socket connected ", socket.id, "with", userAuth);

	if (userAuth.role !== "ADMIN") {
		socket.join(`admin${userAuth.id}`);
	} else {
		socket.join("admin");
	}

	socket.on("message", (messageData: MessageData) => {
		if (messageData.receiverId) {
			socket.to(`admin${messageData.receiverId}`).emit("receive-message", messageData);
			return;
		} else {
			socket.to("admin").emit("receive-message", messageData);
			return;
		}
	});

	socket.on("disconnect", (reason: DisconnectReason, description: any) => {
		console.log(reason);
	});
});

app.get("/", (req, res) => {
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
