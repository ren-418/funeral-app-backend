import bs58 from 'bs58'
import keccak from 'keccak'
import { ethers } from "ethers";
import setlog from "./setlog";

export const sign = async (types, values, signer) => {
	try {
		let messageHash = ethers.utils.solidityKeccak256(types, values);
		let signature = await signer.signMessage(
			ethers.utils.arrayify(messageHash)
		);
		return signature;
	} catch (err) {
		throw new Error(err.message);
	}
};

export const decodeByte32String =  (text: string) => {
	try {
		return ethers.utils.parseBytes32String(text)
	} catch (err) {
		return null;
	}
}
export const encodeByte32String =  (text: string) => {
	try {
		return ethers.utils.formatBytes32String(text)
	} catch (err) {
		return null;
	}
}

function stripHexPrefix(value: string) {
	return value.slice(0, 2) === '0x' || value.slice(0, 2) === '0X' ? value.slice(2) : value
}
export const toChecksumAddress = (address: string) => {
	try {
		if (typeof address !== 'string') return '';
		if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) return '';
		const stripAddress = stripHexPrefix(address).toLowerCase();
		const keccakHash = keccak('keccak256').update(stripAddress).digest('hex');
		let checksumAddress = '0x';
		for (let i = 0; i < stripAddress.length; i++) {
			checksumAddress += parseInt(keccakHash[i], 16) >= 8 ? stripAddress[i]?.toUpperCase() : stripAddress[i];
		}
		return checksumAddress;
	} catch (err) {
		console.log(err);
		setlog("tochecksumaddress", err);
		return address;
	}
}

export const generateAddress = () => {
	const wallet = ethers.Wallet.createRandom()
	return { privatekey: wallet.privateKey, publickey: wallet.address };
}

export const getAddressFromPrivateKey = (privateKey: string) => {
	const w = new ethers.Wallet(privateKey);
	return w.address;
}


export const ZeroAddress = "0x0000000000000000000000000000000000000000";

export const getIdByHash = (text: string) => {
	try {
		const bytes = bs58.decode(text)
        const hex = Buffer.from(bytes).toString('hex')
        const tokenId = hex.slice(4)
        return tokenId
	} catch (err) {
		setlog("getIdByHash", err);
		return null
	}
}

export const recoverPersonalData  =  (data: any, hash: string) => {
	try {
		const k = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("\x19Ethereum Signed Message:\n" + data.length + data));
        const recoveredAddress = ethers.utils.recoverAddress(k, hash)
        return recoveredAddress
	}
	catch (err) {
		setlog("recoverPersonalData", err);
		return null
	}
}