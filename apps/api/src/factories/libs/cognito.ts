import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

export function makeCognitoClient() {
	return new CognitoIdentityProviderClient({
		
	});
}