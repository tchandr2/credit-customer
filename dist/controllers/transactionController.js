"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRelatedCustomers = exports.getCustomerTransactions = void 0;
// Read all transactions
const getCustomerTransactions = async (req, res, next) => {
    const url = 'https://cdn.seen.com/challenge/transactions-v2.1.json';
    const headers = {
        'Content-Type': 'application/json',
    };
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: headers
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        let newArray = [];
        let timelineObj = {
            createdAt: "",
            status: "",
            amount: 0
        };
        let customerTransactionObj = {
            createdAt: "",
            updatedAt: "",
            transactionId: 0,
            authorizationCode: "",
            status: "",
            description: "",
            transactionType: "",
            metadata: {},
            timeline: []
        };
        let customerTransactionArray = {
            'transactions': []
        };
        let temp = 0;
        //Response Logic
        const groupedCustomerTransactions = data.reduce((accumulator, item) => {
            const key = item.authorizationCode;
            if (!accumulator[key]) {
                accumulator[key] = [];
            }
            accumulator[key].push(item);
            return accumulator;
        }, {});
        for (const key in groupedCustomerTransactions) {
            customerTransactionObj = {};
            customerTransactionObj.timeline = [];
            const groupedCustomerTransactionsArray = groupedCustomerTransactions[key];
            for (let i in groupedCustomerTransactionsArray) {
                timelineObj = {};
                const selectedObj = groupedCustomerTransactionsArray[i];
                if (!selectedObj?.metadata?.relatedTransactionId) {
                    customerTransactionObj.createdAt = selectedObj.transactionDate;
                    customerTransactionObj.transactionId = selectedObj.transactionId;
                    customerTransactionObj.authorizationCode = selectedObj.authorizationCode;
                    customerTransactionObj.description = selectedObj.description;
                    customerTransactionObj.transactionType = selectedObj.transactionType;
                    customerTransactionObj.metadata = selectedObj.metadata;
                }
                if (selectedObj?.metadata?.relatedTransactionId) {
                    if (selectedObj.metadata?.relatedTransactionId > temp) {
                        temp = selectedObj.metadata?.relatedTransactionId;
                        customerTransactionObj.updatedAt = selectedObj.transactionDate,
                            customerTransactionObj.status = selectedObj.transactionStatus;
                    }
                }
                timelineObj.createdAt = selectedObj.transactionDate;
                timelineObj.status = selectedObj.transactionStatus;
                timelineObj.amount = selectedObj.amount;
                customerTransactionObj.timeline.push(timelineObj);
            }
            newArray.push(customerTransactionObj);
            customerTransactionArray["transactions"].push(customerTransactionObj);
        }
        res.send(customerTransactionArray);
    }
    catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
};
exports.getCustomerTransactions = getCustomerTransactions;
// Read single transaction
const getRelatedCustomers = async (req, res, next) => {
    const customerId = parseInt(req.params.customerId);
    console.log("customerId");
    console.log(customerId);
    const url = 'https://cdn.seen.com/challenge/transactions-v2.1.json';
    const headers = {
        'Content-Type': 'application/json',
    };
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: headers
        });
        let customerRelationsObj = {
            relatedCustomerId: 0,
            relationType: "",
        };
        let customerelations = {
            "relatedCustomers": []
        };
        let firstCustomerTransactionObj = {
            "transactionId": 0,
            "authorizationCode": "",
            "transactionDate": "",
            "customerId": 0,
            "transactionType": "",
            "transactionStatus": "",
            "description": "",
            "amount": 0,
            "metadata": {}
        };
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const customersBasedOnId = data.filter(item => item.customerId === customerId);
        const customersBasedOnTransactionType = data
            .filter(item => (item.transactionType === "P2P_SEND" || item.transactionType === "P2P_RECEIVE"));
        const groupedCustomersBasedOnRelations = customersBasedOnTransactionType.reduce((accumulator, item) => {
            const key = item.authorizationCode;
            if (!accumulator[key]) {
                accumulator[key] = [];
            }
            accumulator[key].push(item);
            return accumulator;
        }, {});
        console.log("groupedCustomersBasedonRelations");
        console.log(groupedCustomersBasedOnRelations);
        for (const key in groupedCustomersBasedOnRelations) {
            customerRelationsObj = {};
            const relationsArray = groupedCustomersBasedOnRelations[key];
            const relatedCustomers = relationsArray.map(relation => {
                customerRelationsObj.relatedCustomerId = relation.customerId;
                customerRelationsObj.relationType = relation.transactionType;
                customerelations["relatedCustomers"].push(customerRelationsObj);
            });
        }
        res.send(customerelations);
    }
    catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
};
exports.getRelatedCustomers = getRelatedCustomers;
