import express from "express";
import { createServer } from "http";
import { DisconnectReason, Server } from "socket.io";
import cors from "cors";

import bodyParser from "body-parser";
import dotenv from "dotenv";
import chalk from "chalk";
import apiTracker from "./middle ware/apiTracker";

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
	console.log(socket.handshake.auth);

	socket.on("join-room", ({serverId, roomId}: { serverId: string, roomId: string}) => {
		socket.join(`${serverId}/${roomId}`);
		console.log(socket.id, " has join ", `${serverId}/${roomId}`);
	});

	socket.on("message", ({ serverId, roomId, message }: { serverId: string, roomId: string, message: string }) => {
		io.to(`${serverId}/${roomId}`).emit("receive-message", message)
		console.log(`${message} to server: ${serverId} room: ${roomId}`)
	})

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
