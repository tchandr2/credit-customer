import { Request, Response } from 'express';
import { getCustomerTransactions, getRelatedCustomers } from '../src/controllers/customerController';
import httpMocks, { createResponse } from 'node-mocks-http';


describe('Customer Transaction Controller', () => {
    const httpMocks = require('node-mocks-http');

    it('getRelatedCustomers should return a related customers for the specified customerId', async () => {
        const req = httpMocks.createRequest({
            method: 'GET',
            url: '/3/relations',
            params: { customerId: '3' },
        });

        const resArray = [
            {
                "relatedCustomerId": 4,
                "relationType": "P2P_SEND"
            },
            {
                "relatedCustomerId": 6,
                "relationType": "P2P_SEND"
            },
            {
                "relatedCustomerId": 7,
                "relationType": "P2P_SEND"
            },
            {
                "relatedCustomerId": 5,
                "relationType": "WIRE_OUTGOING"
            }
        ]

        const res = httpMocks.createResponse();
        await getRelatedCustomers(req, res, jest.fn());
        expect(res._getStatusCode()).toBe(200);
        expect(res._getData()).toEqual(resArray);

    });

    it('getRelatedCustomers should return 404 when invalid ID is passed', async () => {
        const req = httpMocks.createRequest({
            method: 'GET',
            url: '/20/relations',
            params: { customerId: '20' },
        });

        const res = createResponse();
        await getRelatedCustomers(req, res, jest.fn());
        expect(res._getStatusCode()).toBe(404);
        expect(res._getData()).toBe('Data not found');
    })

    it('getCustomerTransactions should return customers for the specified customerId', async () => {
        const req = httpMocks.createRequest({
            method: 'GET',
            url: '/4/transactions',
            params: { customerId: '4' },
        });
        const res = httpMocks.createResponse();
        const resArray = {
            "transactions": [
                {
                    "timeline": [
                        {
                            "createdAt": "2022-09-06T11:05:00+00:00",
                            "status": "SETTLED",
                            "amount": 10000
                        }
                    ],
                    "createdAt": "2022-09-06T11:05:00+00:00",
                    "transactionId": 16,
                    "authorizationCode": "F10007",
                    "description": "Transfer from Frederik",
                    "transactionType": "P2P_RECEIVE",
                    "metadata": {
                        "relatedTransactionId": 15
                    },
                    "updatedAt": "2022-09-06T11:05:00+00:00",
                    "status": "SETTLED"
                },
                {
                    "timeline": [
                        {
                            "createdAt": "2022-09-06T13:05:00+00:00",
                            "status": "SETTLED",
                            "amount": -10000
                        }
                    ],
                    "createdAt": "2022-09-06T13:05:00+00:00",
                    "transactionId": 17,
                    "authorizationCode": "F10008",
                    "description": "Transfer to Weoy",
                    "transactionType": "P2P_SEND",
                    "metadata": {
                        "relatedTransactionId": 18,
                        "deviceId": "F210200"
                    },
                    "updatedAt": "2022-09-06T13:05:00+00:00",
                    "status": "SETTLED"
                }
            ]
        }
        await getCustomerTransactions(req, res, jest.fn());
        expect(res.statusCode).toBe(200);
        expect(res._getData()).toEqual(resArray);
    });

    it('getCustomerTransactions should return 404 when invalid ID is passed', async () => {
        const req = httpMocks.createRequest({
            method: 'GET',
            url: '/656/transactions',
            params: { customerId: '656' },
        });
        const res = httpMocks.createResponse();
        await getCustomerTransactions(req, res, jest.fn());
        expect(res.statusCode).toBe(404);
        expect(res._getData()).toBe('Data not found');
    });
});