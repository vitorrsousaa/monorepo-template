import { IAuthProvider } from "@data/protocols/auth/auth-provider";
import { makeConfig } from "@factories/config";
import { makeCognitoClient } from "@factories/libs/cognito";
import { CognitoAuthProvider } from "../cognito-auth-provider";

export function makeCognitoAuthProvider(): IAuthProvider {
	return new CognitoAuthProvider(makeCognitoClient(), makeConfig());
}