export interface UserSearchResult {
	userId: string;
	name: string;
	email: string;
}

export interface UserSearchResponse {
	users: UserSearchResult[];
}
