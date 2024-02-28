import chalk from "chalk";
import { Request, Response, NextFunction } from "express";

export default function apiTracker(req: Request, _res: Response, next: NextFunction) {
	const timestamp = new Date().toISOString();
	const method = req.method;
	const url = req.url;

	// Define styles using chalk
	const timestampStyle = chalk.gray.bold;
	const methodStyle = (method: string) => {
		switch (method) {
			case "GET":
				return chalk.green.bold(method);
			case "POST":
				return chalk.blue.bold(method);
			case "PUT":
				return chalk.yellow.bold(method);
			case "DELETE":
				return chalk.red.bold(method);
			default:
				return chalk.white.bold(method);
		}
	};

	// Log the request with styles
	console.log(`${timestampStyle(`[${timestamp}]`)} ${methodStyle(method)} ${url}`);

	next();
}
