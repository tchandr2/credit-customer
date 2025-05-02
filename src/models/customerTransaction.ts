export interface CustomerTransaction {
    transactions: customerTransactionObj[]

}

export interface timelineObj {
    createdAt: string,
    status: string,
    amount: number
}

export interface customerTransactionObj {
    createdAt?: string; // based on the first status
    updatedAt?: string; // based on the latest status
    transactionId?: number, // use the first transaction
    authorizationCode?: string,
    status?: string,
    description?: string,
    transactionType?: string,
    metadata?: {},
    timeline?: timelineObj[]
}



export let customerTransactions: CustomerTransaction[] = [];