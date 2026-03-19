import { STORAGE_KEYS } from "@/config/storage";

function get() {
	return localStorage.getItem(STORAGE_KEYS.LANGUAGE);
}

function set(lang: string) {
	localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
}

function remove() {
	localStorage.removeItem(STORAGE_KEYS.LANGUAGE);
}

export const languageStorage = { get, set, remove };
