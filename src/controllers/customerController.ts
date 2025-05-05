import { Request, Response, NextFunction } from 'express';
import { customerRelations, customerRelation, relationsObj } from '../models/customerRelation';
import { CustomerTransaction, customerTransactionObj, timelineObj } from '../models/customerTransaction';
import { OriginalResponse, originalResponseObj } from '../models/originalResponse';
import CustomerRelationsService from '../services/customerRelationsService';


// Read all transactions
export const getCustomerTransactions = async (req: Request, res: Response, next: NextFunction) => {
  const customerId = parseInt(req.params.customerId);
  const custTransactions = await CustomerRelationsService.getCustomerTransactionsByCustomerId(customerId);;
  if (custTransactions && custTransactions.transactions.length > 0) {
    res.send(custTransactions);
  } else {
    res.status(404).send('Data not found');
  }
};

// Read single transaction
export const getRelatedCustomers = async (req: Request, res: Response, next: NextFunction) => {
  const customerId = parseInt(req.params.customerId);
  const relatedCustomers = await CustomerRelationsService.getRelatedCustomersByCustomerId(customerId);;
  if (relatedCustomers && relatedCustomers.length > 0) {
    res.send(200).send(relatedCustomers);
  } else {
    res.send(404).send('Data not found');
  }
};
