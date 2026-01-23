import { STORAGE_KEYS } from "@/config/storage";

function get() {
	return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
}

function set(token: string) {
	localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
}

function remove() {
	localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
}

export const tokenStorage = {
	get,
	set,
	remove,
};
