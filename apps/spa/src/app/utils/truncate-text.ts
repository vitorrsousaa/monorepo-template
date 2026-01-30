/**
 * Truncates text to a maximum length and appends an ellipsis.
 *
 * @param text - The string to truncate.
 * @param maxLength - Maximum number of characters (before the ellipsis).
 * @returns The original text if within the limit; otherwise the first `maxLength`
 *   characters (after trim) followed by `...`.
 *
 * @example
 * ```ts
 * truncateText("Hello world", 5);   // "Hello..."
 * truncateText("Hi", 10);          // "Hi"
 * truncateText("  Short  ", 20);   // "  Short  "
 * truncateText("Long text here", 4); // "Long..."
 * ```
 */
export function truncateText(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;
	return `${text.slice(0, maxLength).trim()}...`;
}
