import { AuthContext, type IAuthContextValue } from "@/contexts/auth";
import { useContext } from "react";

export function useAuth(): IAuthContextValue {
	const authContext = useContext(AuthContext);

	if (!authContext) {
		throw new Error("useAuth must be used within an AuthProvider");
	}

	return authContext;
}
