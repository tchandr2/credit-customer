
export interface OriginalResponse {
    "originalResponses": originalResponseObj[]

}

export interface originalResponseObj {
    "transactionId": number,
    "authorizationCode": string,
    "transactionDate": string,
    "customerId": number,
    "transactionType": string,
    "transactionStatus": string,
    "description": string,
    "amount": number,
    "metadata": Metadata
}

export type Metadata = {
    relatedTransactionId?: number,
    deviceId?: string
}


