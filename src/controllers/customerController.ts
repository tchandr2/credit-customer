import { Request, Response, NextFunction } from 'express';
import { customerRelations, customerRelation, relationsObj } from '../models/customerRelation';
import { CustomerTransaction, customerTransactionObj, timelineObj } from '../models/customerTransaction';
import { OriginalResponse, originalResponseObj } from '../models/originalResponse';
import CustomerRelationsService from '../services/customerRelationsService';


// Read all transactions
export const getCustomerTransactions = async (req: Request, res: Response, next: NextFunction) => {
  const customerId = parseInt(req.params.customerId);
  const customerTransactions = await CustomerRelationsService.getCustomerTransactionsByCustomerId(customerId);;
  if (customerTransactions) {
    res.send(customerTransactions);
  } else {
    res.status(404).json({ message: 'Data not found' });
  }
};

// Read single transaction
export const getRelatedCustomers = async (req: Request, res: Response, next: NextFunction) => {
  const customerId = parseInt(req.params.customerId);
  const user = await CustomerRelationsService.getRelatedCustomersByCustomerId(customerId);;
  if (user) {
    res.send(user);
  } else {
    res.status(404).json({ message: 'Data not found' });
  }
};
