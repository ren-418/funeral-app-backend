interface AuthDataObject {
	name?: string
	email?: string,
	password?: string
	lasttime: number
	created: number
}

interface CheckListDataObject {
	id:string
	userId:string,
	title: string,
	desc?: string,
	completed:boolean
	created: number
}