import type { IConfig } from "@application/config/environment";
import axios from "axios";
import qs from "qs";
import type { IGoogleAuthProvider, IUserGoogle } from "./types";

export class GoogleAuthProvider implements IGoogleAuthProvider {
	constructor(private readonly config: IConfig) {}

	async getAccessToken(code: string): Promise<string> {
		const options = {
			client_id: this.config.AUTH_GOOGLE_CLIENT_ID,
			client_secret: this.config.AUTH_GOOGLE_CLIENT_SECRET,
			code: code,
			redirect_uri: this.config.AUTH_GOOGLE_REDIRECT_URI,
			grant_type: "authorization_code",
		};

		const stringifiedOptions = qs.stringify(options);

		const googleURL = "https://oauth2.googleapis.com/token";

		const { data } = await axios.post(googleURL, stringifiedOptions, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		});

		const accessToken = data.access_token;

		return accessToken;
	}

	async getUserInfo(accessToken: string): Promise<IUserGoogle> {
		const { data: user } = await axios.get<IUserGoogle>(
			"https://www.googleapis.com/userinfo/v2/me",
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			},
		);

		return user;
	}
}
