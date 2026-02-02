export function delay(ms = 2500) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
