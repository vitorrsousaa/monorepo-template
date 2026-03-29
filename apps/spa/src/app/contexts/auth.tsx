import { LoadingScreen } from "@/components/loading-screen";
import { AppError } from "@/errors/app-error";
import { useGetAccountInfo } from "@/modules/auth/app/hooks/use-get-profile";
import { tokenStorage } from "@/storage/token-storage";
import type { GetAccountInfoResponse } from "@repo/contracts/auth/account";
import { useQueryClient } from "@tanstack/react-query";
import {
	createContext,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";

export interface IAuthContextValue {
	signedIn: boolean;
	signInWithGoogle: () => void;
	signout: () => void;
	user: GetAccountInfoResponse["user"];
	signin: (accessToken: string) => void;
}

export const AuthContext = createContext({} as IAuthContextValue);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [signedIn, setSignedIn] = useState<boolean>(() => {
		const storageAccessToken = tokenStorage.get();

		return !!storageAccessToken;
	});

	const queryClient = useQueryClient();

	const {
		user,
		isProfileError,
		profileError,
		isProfileFetching,
		isProfileSuccess,
	} = useGetAccountInfo({
		enabled: signedIn,
		retry: (failureCount, error) => {
			if (
				error instanceof AppError &&
				(error.statusCode === 401 || error.statusCode === 403)
			) {
				return false;
			}
			return failureCount < 1;
		},
		refetchInterval: 5 * 60 * 1000,
		refetchOnWindowFocus: "always",
	});

	const signInWithGoogle = useCallback(() => {
		// const CLIENT_ID = env.VITE_AUTH_GOOGLE_ID;
		// const baseURL = "https://accounts.google.com/o/oauth2/auth";
		// const options = qs.stringify({
		// 	client_id: CLIENT_ID,
		// 	redirect_uri: env.VITE_AUTH_REDIRECT_URI,
		// 	response_type: "code",
		// 	scope: "email profile",
		// });
		setSignedIn(true);
		// window.location.href = `${baseURL}?${options}`;
	}, []);

	const signout = useCallback(() => {
		tokenStorage.remove();
		queryClient.clear();
		setSignedIn(false);
	}, [queryClient]);

	const signin = useCallback(
		(accessToken: string) => {
			tokenStorage.set(accessToken);
			queryClient.clear();
			setSignedIn(true);
		},
		[queryClient],
	);

	const value = useMemo<IAuthContextValue>(
		() => ({
			signedIn: isProfileSuccess && signedIn,
			signInWithGoogle,
			signout,
			signin,
			user: {
				name: user?.name || "",
				email: user?.email || "",
				id: user?.id || "",
				createdAt: user?.createdAt || "",
				updatedAt: user?.updatedAt || "",
				// picture: data?.picture || "",
			},
		}),
		[signedIn, isProfileSuccess, user, signInWithGoogle, signout, signin],
	);

	useEffect(() => {
		if (!isProfileError || !profileError) return;

		const isAuthError =
			profileError instanceof AppError &&
			(profileError.statusCode === 401 || profileError.statusCode === 403);

		if (isAuthError) {
			signout();
		}
	}, [isProfileError, profileError, signout]);

	return (
		<AuthContext.Provider value={value}>
			{isProfileFetching && <LoadingScreen />}
			{!isProfileFetching && children}
		</AuthContext.Provider>
	);
}
