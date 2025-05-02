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
      .filter(item => (item.transactionType === "P2P_SEND" || item.transactionType === "P2P_RECEIVE"));


    const customersBasedOnCustomerId: OriginalResponse["originalResponses"] = (customersBasedOnTransactionType as OriginalResponse["originalResponses"]).filter(item => item.customerId === customerId);

    const customersRelated: OriginalResponse["originalResponses"] = (customersBasedOnTransactionType as OriginalResponse["originalResponses"]).filter(item1 =>
      customersBasedOnCustomerId.find((item2) => item2.authorizationCode === item1.authorizationCode));

    const relatedCustomersArray: customerRelation["relatedCustomers"] = customersRelated.map(item => {
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
    let newArray: any = [];
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
      const groupedCustomerTransactionsArray = groupedCustomerTransactions[key];


      for (let i in groupedCustomerTransactionsArray) {
        timelineObj = {} as timelineObj;
        const selectedObj = groupedCustomerTransactionsArray[i]

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
        timelineObj.amount = selectedObj.amount
        customerTransactionObj.timeline.push(timelineObj);
      }

      newArray.push(customerTransactionObj);
      customerTransactionArray["transactions"].push(customerTransactionObj);
    }
    return customerTransactionArray;
  }
}

export default new CustomerRelationsService();