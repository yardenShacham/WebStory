const boolType = "boolean"
const funType = "function";
const stringType = "string";

export function isFunction(obj: any) {
	if (!obj)
		return null;

	return typeof obj === funType;
}

export function isUndefined(obj: any) {
	return obj === undefined;
}
export function getFullDateFormated() {
	function getTime(timeDigit: number) {
		return timeDigit < 9 ? `0${timeDigit}` : timeDigit;
	}

	const date = new Date();
	return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${getTime(date.getHours() + 1)}:${getTime(date.getMinutes() + 1)}`;
}
export function isNull(obj: any) {
	return obj === null;
}

export function isBoolean(obj: any) {
	if (!obj)
		return null;

	return typeof obj === boolType;
}

export function isString(obj: any) {
	if (!obj)
		return null;

	return typeof obj === stringType;
}

export function getTemplate(htmlTemplate: string) {
	return function (data: any) {
		let keys = Object.keys(data);
		for (let i = 0; i < keys.length; i++) {
			let reg = new RegExp((<any>getTemplate).interpolateReg.replace("key", keys[i]), 'g');
			htmlTemplate = htmlTemplate.replace(reg, data[keys[i]]);
		}
		return htmlTemplate;
	}
}
(<any>getTemplate).interpolateReg = "{{key}}";


export function getHtmlAsString(htmlPath: any) {
	let fs = require('fs');
	let path = require('path');
	let strinfData = fs.readFileSync(path.resolve(`${__dirname}/${htmlPath}`), 'utf-8');
	return strinfData;
}
