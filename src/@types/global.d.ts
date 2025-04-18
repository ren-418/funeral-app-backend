interface AuthDataObject {
	name?: string
	email?: string,
	password?: string
	isFullAccess?:boolean,
	subscription?:number
	lasttime: number
	created: number
}

interface CheckListDataObject {
	id:string
	userId:string,
	title: string,
	desc?: string,
	sharedTo:string[],
	completed:boolean
	created: number
}


interface VaultDataObject {
	id:string;
    userId: string;
    title: string;
    desc?: string;
    filePath: string;
	fileType:string
	sharedTo:string[],
	created: number
}

interface TransactionDataObject {
	id:string,
	userId:string,
	amount:number,
	created:number
}