import { Request, Response } from 'express';
import { getCustomerTransactions, getRelatedCustomers } from '../src/controllers/customerController';
import httpMocks from 'node-mocks-http';


describe('Customer Transaction Controller', () => {
    const httpMocks = require('node-mocks-http');

    it('getRelatedCustomers should return a related customers for the specified customerId', () => {
        const req = httpMocks.createRequest({
            method: 'GET',
            url: '/1/relations',
            params: { id: '1' },
        });
        const res = httpMocks.createResponse();
        getRelatedCustomers(req, res, jest.fn());
        expect(res.statusCode).toBe(200);
    });

    it('getCustomerTransactions should return customers ffor the specified customerId', () => {
        const req = httpMocks.createRequest({
            method: 'GET',
            url: '/1/transactions',
            params: { id: '0' },
        });
        const res = httpMocks.createResponse();
        getCustomerTransactions(req, res, jest.fn());
        expect(res.statusCode).toBe(200);
    });
});