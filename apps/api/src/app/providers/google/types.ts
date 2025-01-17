export interface IUserGoogle {
	verified_email?: string;
	name: string;
	id: string;
	picture: string;
	email: string;
}

export interface IGoogleAuthProvider {
	getAccessToken(code: string): Promise<string>;
	getUserInfo(accessToken: string): Promise<IUserGoogle>;
}
