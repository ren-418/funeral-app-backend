interface AuthDataObject {
	name?: string
	email?: string,
	password?: string
	isFullAccess?:boolean
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