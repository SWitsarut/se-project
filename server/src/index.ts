import express from "express";
import { createServer } from "http";
import { DisconnectReason, Server } from "socket.io";
import cors from "cors";

import bodyParser from "body-parser";
import dotenv from "dotenv";
import chalk from "chalk";
import apiTracker from "./middle ware/apiTracker";
import { RoomMsg } from "./type/Room";

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(apiTracker);

const port = process.env.API_PORT;
const server = createServer(app);

// app.get
const io = new Server(server, {
	cors: {
		origin: ["http://localhost:5173", "http://localhost:3000"],
		methods: ["GET", "POST"],
	},
});

io.on("connection", (socket) => {
	console.log(socket.handshake.auth.token);

	socket.on("join-room", (roomString: string) => {
		socket.join(roomString);
		console.log(socket.id, " has join ", roomString);
	});

	socket.on("message", (message: RoomMsg) => {
		io.to(message.room).emit("receive-message", message);
		console.log("msg", message);
	});

	socket.on("disconnect", (reason: DisconnectReason, description: any) => {
		console.log(reason);
	});
});

server.listen(port, () => {
	console.log(
		chalk.yellow.bold("Server ") +
			chalk.bold.green("is running ") +
			chalk.blue.bold(`at http://localhost:${port}`)
	);
});
