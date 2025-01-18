import axios from "axios";
import bcrypt from 'bcrypt'
import { ethers } from "ethers";
import config from "../../config.json";
import { sign } from "./blockchain";
import setlog from "./setlog";


/**
 * set delay for delayTimes
 * @param {Number} delayTimes - timePeriod for delay
 */
export const delay = (delayTimes: number) => {
	return new Promise((resolve: any) => {
		setTimeout(() => {
			resolve(2);
		}, delayTimes);
	});
};

/**
 * change data type from Number to BigNum
 * @param {Number} value - data that need to be change
 * @param {Number} d - decimals
 */
export const toBigNum = (value: number | string, d = 18) => {
	return ethers.utils.parseUnits(String(value), d);
};

/**
 * change data type from BigNum to Number
 * @param {Number} value - data that need to be change
 * @param {Number} d - decimals
 */
export const fromBigNum = (value: number | string, d = 18) => {
	return ethers.utils.formatUnits(value, d);
};

/**
 * change data array to no duplicate
 */
export const getNoDoubleArray = (value: [string | number]) => {
	let newArray = [];
	for (let i = 0; i < value.length; i++) {
		if (newArray.indexOf(value[i]) === -1) {
			newArray.push(value[i]);
		}
	}
	return newArray;
};

export const hex = (arrayBuffer: Buffer) => {
	return Array.from(new Uint8Array(arrayBuffer))
		.map(n => n.toString(16).padStart(2, "0"))
		.join("");
}

export const CryptPassword = async (password: string) => {
	return await bcrypt.hash(password, 10);
};

// decrypt password
export const DecryptPassword = async (
	password: string,
	savedPassword: string
) => {
	return await bcrypt.compare(password, savedPassword);
};

export const Now = () => Math.round(new Date().getTime() / 1000);


export const randomCode = () => {
	var minm = 100000;
	var maxm = 999999;
	return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
}



export const ellipsis = (address: string, start: number=6) => {
	if (!address || address == null) return ''
	const len = (start ) + 7;
	return address.length > len ? `${address?.slice(0, start)}...${address?.slice(-4)}` : address
}


// External Utils
export { sign };
