"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const customerController_1 = require("./customerController");
describe('Transaction Controller', () => {
    const httpMocks = require('node-mocks-http');
    it('should return a related customers for the specified customerId', () => {
        const req = httpMocks.createRequest({
            method: 'GET',
            url: '/users/123',
            params: { id: '123' },
        });
        const res = httpMocks.createResponse();
        (0, customerController_1.getRelatedCustomers)(req, res, jest.fn());
        expect(res.statusCode).toBe(200);
    });
    // it('should return an empty array when no transactions exist', () => {
    //     const req = {} as Request;
    //     const res = { json: jest.fn() } as unknown as Response;
    //     const a = getRelatedCustomers(req, res, jest.fn());
    //     console.log(a);
    //     expect(res.status).toHaveBeenCalledWith(500);
    // });
});
