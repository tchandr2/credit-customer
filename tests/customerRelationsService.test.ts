import { Request, Response } from 'express';
import { getRelatedCustomers } from '../src/controllers/customerController';
import customerRelationsService from '../src/services/customerRelationsService';


// describe('Customer Relation Service', () => {
//     const httpMocks = require('node-mocks-http');

//     const mockRelatedCustomer = {
//         "relatedCustomers": [
//             {
//                 "relatedCustomerId": 3,
//                 "relationType": "P2P_SEND"
//             },
//             {
//                 "relatedCustomerId": 5,
//                 "relationType": "P2P_RECEIVE"
//             },
//             {
//                 "relatedCustomerId": 3,
//                 "relationType": "DEVICE"
//             }
//         ]
//     };

//     const mockCustomerTransaction = {
//         "transactions": [
//             {
//                 "createdAt": "2022-09-01T11:46:42+00:00", // based on the first status
//                 "updatedAt": "2022-09-03T15:41:42+00:00", // based on the latest status
//                 "transactionId": 1, // use the first transaction
//                 "authorizationCode": "F10000",
//                 "status": "SETTLED",
//                 "description": "Amazon.com",
//                 "transactionType": "POS",
//                 "metadata": {},
//                 "timeline": [
//                     {
//                         "createdAt": "2022-09-01T11:46:42+00:00",
//                         "status": "PROCESSING",
//                         "amount": 5000.00
//                     },
//                     {
//                         "createdAt": "2022-09-03T15:41:42+00:00",
//                         "status": "SETTLED",
//                         "amount": 5000.00
//                     }
//                 ]
//             }
//         ]
//     }

//     it('should return a related customers for the specified customerId', () => {
//         const req = httpMocks.createRequest({
//             method: 'GET',
//             url: '/1/relations',
//             params: { id: '1' },
//         });
//         const res = httpMocks.createResponse();
//         const result = customerRelationsService.getRelatedCustomersByCustomerId(1);
//         expect(result).toHaveBeenCalled();
//     });
// });