import { OriginalResponse } from "../models/originalResponse";
import { customerRelations, customerRelation, relationsObj } from '../models/customerRelation';
import { CustomerTransaction, customerTransactionObj, timelineObj } from '../models/customerTransaction';


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

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }


  async getRelatedCustomersByCustomerId(customerId: number) {

    const data = await this.getData();

    let customerRelationsObj: relationsObj = {
      relatedCustomerId: 0,
      relationType: "",
    };

    const customersBasedOnTransactionType: OriginalResponse["originalResponses"] = (data as OriginalResponse["originalResponses"])
      .filter(item => (item.transactionType === "P2P_SEND" || item.transactionType === "P2P_RECEIVE" || item.metadata?.deviceId));

    const customersBasedOnCustomerId: OriginalResponse["originalResponses"] = (customersBasedOnTransactionType as OriginalResponse["originalResponses"]).filter(item => item.customerId === customerId);

    const relatedCustomersWithTransactionId = customersBasedOnTransactionType.filter(item1 =>
      customersBasedOnCustomerId.some(item2 => {
        if (item2.metadata.relatedTransactionId) {
          if (item2.metadata.relatedTransactionId === item1.transactionId) {
            return true;
          }
        }
      })
    );

    const relatedCustomersWithDeviceId = customersBasedOnTransactionType.filter(item1 =>
      customersBasedOnCustomerId.some(item2 => {
        if (item2.metadata.deviceId) {
          if (item1.customerId != customerId) {
            if (item2.metadata.deviceId === item1.metadata.deviceId) {
              return true;
            }
          }
        }
      })
    );

    const mergedArray = [
      ...new Map([...relatedCustomersWithTransactionId, ...relatedCustomersWithDeviceId].map(item => [item.customerId, item])).values()
    ];

    const relatedCustomersArray: customerRelation["relatedCustomers"] = mergedArray.map(item => {
      customerRelationsObj = {} as relationsObj;
      customerRelationsObj.relatedCustomerId = item.customerId;
      customerRelationsObj.relationType = item.transactionType;
      return customerRelationsObj;
    });


    return relatedCustomersArray;

  }

  async getCustomerTransactionsByCustomerId(customerId: number) {
    const data = await this.getData();

    const customersBasedOnCustomerId: OriginalResponse["originalResponses"] = (data as OriginalResponse["originalResponses"]).filter(item => item.customerId === customerId);

    let timelineObj: timelineObj = {
      createdAt: "",
      status: "",
      amount: 0
    };
    let customerTransactionObj: customerTransactionObj = {
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
    let customerTransactionArray: CustomerTransaction = {
      'transactions': []
    };
    let temp = 0;

    //Response Logic
    const groupedCustomerTransactions = (customersBasedOnCustomerId as any).reduce((accumulator: any, item: any) => {
      const key = item.authorizationCode;
      if (!accumulator[key]) {
        accumulator[key] = [];
      }
      accumulator[key].push(item);
      return accumulator;
    }, {});


    for (const key in groupedCustomerTransactions) {
      customerTransactionObj = {} as customerTransactionObj;
      customerTransactionObj.timeline = [];
      const groupedCustomerTransactionsArray: OriginalResponse['originalResponses'] = groupedCustomerTransactions[key];

      //sort objects based on date
      groupedCustomerTransactionsArray.sort((a, b) => {
        const date1 = new Date(a.transactionDate);
        const date2 = new Date(b.transactionDate);
        return date1.getTime() - date2.getTime()
      });

      console.log(groupedCustomerTransactionsArray);


      for (let i in groupedCustomerTransactionsArray) {
        timelineObj = {} as timelineObj;
        const selectedObj = groupedCustomerTransactionsArray[i]

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
        timelineObj.amount = selectedObj.amount
        customerTransactionObj.timeline.push(timelineObj);
      }

      customerTransactionArray["transactions"].push(customerTransactionObj);
    }
    return customerTransactionArray;
  }
}

export default new CustomerRelationsService();