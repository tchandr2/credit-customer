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
            .filter(item => (item.transactionType === "P2P_SEND" || item.transactionType === "P2P_RECEIVE" || item.metadata?.deviceId));
        const customersBasedOnCustomerId = customersBasedOnTransactionType.filter(item => item.customerId === customerId);
        const relatedCustomersWithTransactionId = customersBasedOnTransactionType.filter(item1 => customersBasedOnCustomerId.some(item2 => {
            if (item2.metadata.relatedTransactionId) {
                if (item2.metadata.relatedTransactionId === item1.transactionId) {
                    return true;
                }
            }
        }));
        const relatedCustomersWithDeviceId = customersBasedOnTransactionType.filter(item1 => customersBasedOnCustomerId.some(item2 => {
            if (item2.metadata.deviceId) {
                if (item1.customerId != customerId) {
                    if (item2.metadata.deviceId === item1.metadata.deviceId) {
                        return true;
                    }
                }
            }
        }));
        const mergedArray = [
            ...new Map([...relatedCustomersWithTransactionId, ...relatedCustomersWithDeviceId].map(item => [item.customerId, item])).values()
        ];
        const relatedCustomersArray = mergedArray.map(item => {
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
        console.log(groupedCustomerTransactions);
        for (const key in groupedCustomerTransactions) {
            customerTransactionObj = {};
            customerTransactionObj.timeline = [];
            const groupedCustomerTransactionsArray = groupedCustomerTransactions[key];
            //sort objects based on date
            groupedCustomerTransactionsArray.sort((a, b) => {
                const date1 = new Date(a.transactionDate);
                const date2 = new Date(b.transactionDate);
                return date1.getTime() - date2.getTime();
            });
            for (let i in groupedCustomerTransactionsArray) {
                timelineObj = {};
                const selectedObj = groupedCustomerTransactionsArray[i];
                if (i === "0") {
                    customerTransactionObj.createdAt = selectedObj.transactionDate;
                    customerTransactionObj.transactionId = selectedObj.transactionId;
                    customerTransactionObj.authorizationCode = selectedObj.authorizationCode;
                    customerTransactionObj.description = selectedObj.description;
                    customerTransactionObj.transactionType = selectedObj.transactionType;
                    customerTransactionObj.metadata = selectedObj.metadata;
                }
                else {
                    customerTransactionObj.updatedAt = selectedObj.transactionDate,
                        customerTransactionObj.status = selectedObj.transactionStatus;
                }
                if (groupedCustomerTransactionsArray.length === 1) {
                    customerTransactionObj.updatedAt = selectedObj.transactionDate,
                        customerTransactionObj.status = selectedObj.transactionStatus;
                }
                timelineObj.createdAt = selectedObj.transactionDate;
                timelineObj.status = selectedObj.transactionStatus;
                timelineObj.amount = selectedObj.amount;
                customerTransactionObj.timeline.push(timelineObj);
            }
            customerTransactionArray["transactions"].push(customerTransactionObj);
        }
        return customerTransactionArray;
    }
}
exports.default = new CustomerRelationsService();
