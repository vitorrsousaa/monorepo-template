export interface AuthSignUpParams {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
}

export interface AuthSignUpResult {
	userId: string;
}

export interface AuthSignInParams {
	email: string;
	password: string;
}

export interface AuthSignInResult {
	accessToken: string;
	refreshToken: string;
	idToken: string;
}

export interface IAuthProvider {
	signUp(params: AuthSignUpParams): Promise<AuthSignUpResult>;
	signIn(params: AuthSignInParams): Promise<AuthSignInResult>;
}
