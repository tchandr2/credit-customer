export interface OriginalResponse {
    "originalResponses": originalResponseObj[]

}

export type originalResponseObj = {
    "transactionId": number,
    "authorizationCode": string,
    "transactionDate": string,
    "customerId": number,
    "transactionType": string,
    "transactionStatus": string,
    "description": string,
    "amount": number,
    "metadata": {}
}