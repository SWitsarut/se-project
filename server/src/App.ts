import express from "express";
import { createServer } from "http";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const server = createServer(app);

const port = process.env.API_PORT;
server.listen(port, () => {
	console.log(`running on http://localhost:${port}`);
});
