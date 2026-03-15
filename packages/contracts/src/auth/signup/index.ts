export interface SignupInput {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

export interface SignupResponse {
	userId: string;
}
