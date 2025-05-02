"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transactionController_1 = require("../controllers/transactionController");
const router = (0, express_1.Router)();
router.get('/:customerId/transactions', transactionController_1.getCustomerTransactions);
router.get('/:customerId/relations', transactionController_1.getRelatedCustomers);
exports.default = router;
