import type { UserSearchResult } from "@repo/contracts/sharing/user-search";

export interface UserSearchInputService {
	email: string;
}

export interface UserSearchOutputService {
	user: UserSearchResult | null;
}
