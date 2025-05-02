export interface customerRelation {
	relatedCustomers:
	relationsObj[]
}

export interface relationsObj {
	relatedCustomerId: number,
	relationType: string,
}

export let customerRelations: customerRelation[] = [];