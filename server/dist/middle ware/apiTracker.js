"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
function apiTracker(req, res, next) {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.url;
    // Define styles using chalk
    const timestampStyle = chalk_1.default.gray.bold;
    const methodStyle = (method) => {
        switch (method) {
            case "GET":
                return chalk_1.default.green.bold(method);
            case "POST":
                return chalk_1.default.blue.bold(method);
            case "PUT":
                return chalk_1.default.yellow.bold(method);
            case "DELETE":
                return chalk_1.default.red.bold(method);
            default:
                return chalk_1.default.white.bold(method);
        }
    };
    // Log the request with styles
    console.log(`${timestampStyle(`[${timestamp}]`)} ${methodStyle(method)} ${url}`);
    next();
}
exports.default = apiTracker;
