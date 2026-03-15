export interface SigninInput {
	email: string;
	password: string;
}

export interface SigninResponse {
	accessToken: string;
	refreshToken: string;
	idToken: string;
}
