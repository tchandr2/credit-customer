import { Router } from 'express';
import { getRelatedCustomers, getCustomerTransactions } from '../controllers/customerController';


const router = Router();

router.get('/:customerId/transactions', getCustomerTransactions);
router.get('/:customerId/relations', getRelatedCustomers);

export default router 