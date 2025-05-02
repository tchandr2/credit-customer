"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomerRelationsService {
    async getData() {
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
            return data;
        }
        catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    async getRelatedCustomersByCustomerId(customerId) {
        const data = await this.getData();
        let customerRelationsObj = {
            relatedCustomerId: 0,
            relationType: "",
        };
        const customersBasedOnTransactionType = data
            .filter(item => (item.transactionType === "P2P_SEND" || item.transactionType === "P2P_RECEIVE"));
        const customersBasedOnCustomerId = customersBasedOnTransactionType.filter(item => item.customerId === customerId);
        const customersRelated = customersBasedOnTransactionType.filter(item1 => customersBasedOnCustomerId.find((item2) => item2.authorizationCode === item1.authorizationCode));
        const relatedCustomersArray = customersRelated.map(item => {
            customerRelationsObj = {};
            customerRelationsObj.relatedCustomerId = item.customerId;
            customerRelationsObj.relationType = item.transactionType;
            return customerRelationsObj;
        });
        return relatedCustomersArray;
    }
    async getCustomerTransactionsByCustomerId(customerId) {
        const data = await this.getData();
        const customersBasedOnCustomerId = data.filter(item => item.customerId === customerId);
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
        const groupedCustomerTransactions = customersBasedOnCustomerId.reduce((accumulator, item) => {
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
                    customerTransactionObj.updatedAt = "",
                        customerTransactionObj.status = "";
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
        return customerTransactionArray;
    }
}
exports.default = new CustomerRelationsService();
