import express from "express";
import { createServer } from "http";
import { DisconnectReason, Server } from "socket.io";
import cors from "cors";

import bodyParser from "body-parser";
import dotenv from "dotenv";
import chalk from "chalk";
import apiTracker from "./middle ware/apiTracker";
import { createTransport } from "nodemailer";

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

app.get("/mail",(req,res)=>{

	 const transport = createTransport({
		service:"gmail",
		auth:{
			user:"",
			pass:""
		}
	 })

	 const mailOptions = {
			from: "",
			to: "",
			subject: "",
			text: "",
		};
		transport.sendMail(mailOptions,(err,info)=>{
			if(err){
				res.status(300).send(err)
			}
			else{
				res.send(info)
			}
		})
})

io.on("connection", (socket) => {
	console.log("New socket connected " + socket.id);

	socket.on("message", () => {
		io.to(``).emit("receive-message")
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
