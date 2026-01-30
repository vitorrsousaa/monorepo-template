import { toCamelCase, toKebabCase, toPascalCase } from "../../../utils";

export function getControllerSchemaTemplate(
	moduleName: string,
	controllerName: string,
) {
	const pascal = toPascalCase(controllerName);
	const camel = toCamelCase(controllerName);
	const kebab = toKebabCase(controllerName);
	const moduleKebab = toKebabCase(moduleName);
	return `import { ${pascal}InputDTO } from "@application/modules/${moduleKebab}/services/${kebab}/dto";

export const ${camel}Schema = ${pascal}InputDTO;
`;
}
