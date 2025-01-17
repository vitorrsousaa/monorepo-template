(function Template() {
	const toPascalCase = (str) =>
		str
			.replace(/(?:^\w|[A-Z]|\b\w)/g, (fl) => fl.toUpperCase())
			.replace(/\W+/g, "");

	const toCamelCase = (str) =>
		toPascalCase(str).replace(/^./, (firstLetter) => firstLetter.toLowerCase());
  
  const toKebabCase = (str) => 
    str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, ''); 

	return {
		userInputs: [
			{
				title: "Lambda Name",
				argumentName: "name",
				defaultValue: "Sample",
			},
		],
		template: [
			{
				type: "folder",
				name: (inputs) => `${toKebabCase(inputs.name)}`,
				children: [
					{
						type: "file",
						name: (inputs) => "handler.ts",
						content: (inputs) => `import { requestAdapter } from "@server/adapters/request";
import { responseAdapter } from "@server/adapters/response";

import type { APIGatewayProxyEventV2 } from 'aws-lambda';
	
export async function handler(event: APIGatewayProxyEventV2) {
	const controller = makeController()
	
	const response = await controller.handle(requestAdapter(event));
		
	return responseAdapter(response);
}
`,
					},
					{
						type: "file",
						name: (inputs) => "index.ts",
						content: (inputs) => `export * from './handler';`,
					},
					{
						type: "file",
						name: (inputs) => "handler.doc.yml",
						content: (inputs) => `${toCamelCase(inputs.name)}:
  summary: Sample Lambda
  description: Sample Lambda
  security:
    - CognitoAuthorizer: []
  tags:
    - Sample
  requestBody:
    description: Sample request body
    required: true
  requestModels:
    application/json: 
      $schema: http://json-schema.org/draft-04/schema#
      properties:
        email:
          type: string
          example: user@email.com
      required:
        - email
  methodResponses:
    - statusCode: 200
      responseBody:
        description: Return default response
      responseModels:
        application/json: 
          schema:
            $schema: http://json-schema.org/draft-04/schema#
            properties:
              message:
                type: string
                example: ok
    - statusCode: 401
      responseBody:
        description: Not authorized
      responseModels:
        application/json: NotAuthorizedResponse
    - statusCode: 422
      responseBody:
        description: An error message when send invalid data
      responseModels:
        application/json: ValidationErrorResponse
    - statusCode: 500
      responseBody:
        description: An unknown error message
      responseModels:
        application/json: ErrorResponse
`,
					},
				],
			},
		],
	};
});
