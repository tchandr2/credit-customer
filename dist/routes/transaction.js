"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customerController_1 = require("../controllers/customerController");
const router = (0, express_1.Router)();
router.get('/:customerId/transactions', customerController_1.getCustomerTransactions);
router.get('/:customerId/relations', customerController_1.getRelatedCustomers);
exports.default = router;
