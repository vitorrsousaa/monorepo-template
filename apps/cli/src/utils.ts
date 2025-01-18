export const toPascalCase = (str: string) =>
	str
		.replace(/(?:^\w|[A-Z]|\b\w)/g, (fl) => fl.toUpperCase())
		.replace(/\W+/g, "");

export const toCamelCase = (str: string) =>
	toPascalCase(str).replace(/^./, (firstLetter) => firstLetter.toLowerCase());

export const toKebabCase = (str: string) =>
	str
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
