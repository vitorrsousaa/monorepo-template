import { Config } from "@application/config/environment";
import { AppError } from "@application/errors/app-error";
import {
	CognitoIdentityProviderClient,
	InitiateAuthCommand,
	InvalidParameterException,
	InvalidPasswordException,
	SignUpCommand,
	UsernameExistsException,
} from "@aws-sdk/client-cognito-identity-provider";
import type {
	AuthSignInParams,
	AuthSignInResult,
	AuthSignUpParams,
	AuthSignUpResult,
	IAuthProvider,
} from "@data/protocols/auth/auth-provider";
import {
	InvalidParameterError,
	InvalidPasswordError,
	UsernameExistsError,
} from "./errors";

export class CognitoAuthProvider implements IAuthProvider {


	constructor(private readonly client: CognitoIdentityProviderClient, private readonly config: Config) {
		
	}

	async signUp(params: AuthSignUpParams): Promise<AuthSignUpResult> {
		try {
			const command = new SignUpCommand({
				ClientId: this.config.COGNITO_CLIENT_ID,
				Username: params.email,
				Password: params.password,
				UserAttributes: [
					{ Name: "given_name", Value: params.firstName },
					{ Name: "family_name", Value: params.lastName },
				],
			});
			
			const result = await this.client.send(command);
			const userId = result.UserSub as string;
			
			if (!userId) {
				throw new AppError("Sign up did not return a user id", 500);
			}
			
			return { userId };
		} catch (error) {
			if (error instanceof UsernameExistsException) {
				throw new UsernameExistsError();
			}

			if (error instanceof InvalidPasswordException) {
				throw new InvalidPasswordError();
			}

			if (error instanceof InvalidParameterException) {
				throw new InvalidParameterError();
			}

			throw new AppError("Internal Server Error", 500);
		}
	}

	async signIn(params: AuthSignInParams): Promise<AuthSignInResult> {
		try {
			const command = new InitiateAuthCommand({
				ClientId: this.config.COGNITO_CLIENT_ID,
				AuthFlow: "USER_PASSWORD_AUTH",
				AuthParameters: {
					USERNAME: params.email,
					PASSWORD: params.password,
				},
			});
			const result = await this.client.send(command);
			const authResult = result.AuthenticationResult;
			if (
				!authResult?.AccessToken ||
				!authResult?.RefreshToken ||
				!authResult?.IdToken
			) {
				throw new AppError("Invalid credentials", 401);
			}
			return {
				accessToken: authResult.AccessToken,
				refreshToken: authResult.RefreshToken,
				idToken: authResult.IdToken,
			};
		} catch (error) {
			throw this.mapSignInError(error);
		}
	}
	
	private mapSignInError(error: unknown): AppError {
		if (error instanceof AppError) return error;
		const name = error instanceof Error ? error.name : String(error);
		switch (name) {
			case "NotAuthorizedException":
			case "UserNotFoundException":
				return new AppError("Invalid credentials", 401);
			case "InvalidParameterException":
				return new AppError(
					error instanceof Error ? error.message : "Invalid request",
					400,
				);
			default:
				return new AppError("Sign in failed", 500);
		}
	}
}
