"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRelatedCustomers = exports.getCustomerTransactions = void 0;
const customerRelationsService_1 = __importDefault(require("../services/customerRelationsService"));
// Read all transactions
const getCustomerTransactions = async (req, res, next) => {
    const customerId = parseInt(req.params.customerId);
    const customerTransactions = await customerRelationsService_1.default.getCustomerTransactionsByCustomerId(customerId);
    ;
    if (customerTransactions) {
        res.send(customerTransactions);
    }
    else {
        res.status(404).json({ message: 'Data not found' });
    }
};
exports.getCustomerTransactions = getCustomerTransactions;
// Read single transaction
const getRelatedCustomers = async (req, res, next) => {
    const customerId = parseInt(req.params.customerId);
    const user = await customerRelationsService_1.default.getRelatedCustomersByCustomerId(customerId);
    ;
    if (user) {
        res.send(user);
    }
    else {
        res.status(404).json({ message: 'Data not found' });
    }
};
exports.getRelatedCustomers = getRelatedCustomers;
