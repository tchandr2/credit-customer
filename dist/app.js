"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const errorHandler_1 = require("./middlewares/errorHandler");
const transaction_1 = __importDefault(require("./routes/transaction"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
//Routes
app.use('/api/v1/customers', transaction_1.default);
app.use('/api/v1/customers', transaction_1.default);
//Global error handler
app.use(errorHandler_1.errorHandler);
exports.default = app;
