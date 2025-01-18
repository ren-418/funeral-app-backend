import { recoverPersonalData } from "../../utils/blockchain";
import authDatas from "../data-access";


// check if account is exist
const checkExistOfAccount = async ({ name, email, address }) => {
	var existsAddress = await authDatas.AuthDB.findOne({
		filter: { address: address }
	});
	if (!!existsAddress)
		return {
			res: true,
			param: "address",
			msg: "address is Exist"
		}

	var existsName = await authDatas.AuthDB.findOne({
		filter: { name: name }
	});
	if (!!existsName)
		return {
			res: true,
			param: "name",
			msg: "name is Exist"
		}
	var existsEmail = await authDatas.AuthDB.findOne({
		filter: { email: email }
	});
	if (!!existsEmail)
		return {
			res: true,
			param: "email",
			msg: "email is Exist"
		}

	return {
		res: false,
		param: "none",
		msg: "true"
	}
}

// check signature is invalid
const verifySignature = ({ sig, address }: { sig: string, address: string }) => {
	const msg = `Welcome to CBETWORLD! \n Click to sign in and accept the Terms of Service. \n This request will not trigger a blockchain transaction or cost any gas fees. \n Wallet address: ${address}`;
	const sigAddress = recoverPersonalData(msg, sig);
	return sigAddress !== address;
}

const authService = {
	checkExistOfAccount,
	verifySignature
}

export default authService