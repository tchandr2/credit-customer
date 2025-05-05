
import CustomerRelationsService from '../src/services/customerRelationsService';

const mockTransactionData = [{ "amount": 5000, "authorizationCode": "F10000", "customerId": 1, "description": "Deposit from Citibank", "metadata": {}, "transactionDate": "2022-09-01T11:46:42+00:00", "transactionId": 1, "transactionStatus": "PENDING", "transactionType": "ACH_INCOMING" },
{ "amount": 5000, "authorizationCode": "F10000", "customerId": 1, "description": "Deposit from Citibank", "metadata": { "relatedTransactionId": 1 }, "transactionDate": "2022-09-03T15:41:42+00:00", "transactionId": 2, "transactionStatus": "SETTLED", "transactionType": "ACH_INCOMING" },
{ "amount": -143.21, "authorizationCode": "F10001", "customerId": 1, "description": "Amazon", "metadata": {}, "transactionDate": "2022-09-05T11:36:42+00:00", "transactionId": 3, "transactionStatus": "PENDING", "transactionType": "POS" },
];

const mockRelatedCustomer = [
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

const mockCustomerTransaction = {
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
};

jest.mock('../src/services/customerRelationsService', () => ({
    getData: jest.fn(() => mockTransactionData),
    getRelatedCustomersByCustomerId: jest.fn(() => mockRelatedCustomer),
    getCustomerTransactionsByCustomerId: jest.fn(() => mockCustomerTransaction)
}));

describe('Customer Relation Service', () => {

    it('getData should fetch data successfully', async () => {
        const result = CustomerRelationsService.getData();
        expect(result).toBe(mockTransactionData);

    });

    it('getRelatedCustomersByCustomerId should fetch data successfully', async () => {
        const result = CustomerRelationsService.getRelatedCustomersByCustomerId(5);
        expect(result).toBe(mockRelatedCustomer);
    });

    it('getCustomerTransactionsByCustomerId should fetch data successfully', async () => {
        const result = CustomerRelationsService.getCustomerTransactionsByCustomerId(1);
        expect(result).toBe(mockCustomerTransaction);
    });
});