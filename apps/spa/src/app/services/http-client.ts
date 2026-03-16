import { tokenStorage } from "@/storage/token-storage";
import { delay } from "@/utils/delay";
import axios from "axios";
import { AppError } from "../errors/app-error";

const { VITE_API_BASE_URL, DEV: IS_DEVELOPMENT } = import.meta.env;

export const httpClient = axios.create({
	baseURL: VITE_API_BASE_URL,
});

httpClient.interceptors.request.use((config) => {
	const accessToken = tokenStorage.get();

	if (accessToken) {
		config.headers.Authorization = `Bearer ${accessToken}`;
	}

	return config;
});

httpClient.interceptors.request.use((config) => {
	// config.headers.set("Access-Control-Allow-Origin", "https://localhost:5173");
	config.headers["Content-Type"] = "application/json";

	return config;
});

httpClient.interceptors.response.use(
	async (data) => {
		if (IS_DEVELOPMENT) {
			await delay();
		}

		return data;
	},
	async (error) => {
		if (IS_DEVELOPMENT) {
			await delay();
		}

		return Promise.reject(new AppError(error));
	},
);
