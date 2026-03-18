import { LoadingScreen } from "@/components/loading-screen";
import { QUERY_KEYS } from "@/config/query-keys";
import { useGetProfile } from "@/modules/auth/app/hooks/use-get-profile";
import { tokenStorage } from "@/storage/token-storage";
import type { ProfileResponse } from "@repo/contracts/auth/profile";
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
	user: ProfileResponse["user"];
	signin: (accessToken: string) => void;
}

export const AuthContext = createContext({} as IAuthContextValue);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [signedIn, setSignedIn] = useState<boolean>(() => {
		const storageAccessToken = tokenStorage.get();

		return !!storageAccessToken;
	});

	const queryClient = useQueryClient();

	const { user, isProfileError, isProfileFetching, isProfileSuccess } =
		useGetProfile({ enabled: signedIn, staleTime: Number.POSITIVE_INFINITY });

	console.log(isProfileError, isProfileFetching, signedIn, isProfileSuccess)


	// const { data, isFetching, isSuccess, isError } = useQuery({
	//   queryKey: QUERY_KEYS.PROFILE,
	//   queryFn: authServices.profile,
	//   enabled: signedIn,
	//   staleTime: Number.POSITIVE_INFINITY,
	// });

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
		queryClient.removeQueries({ queryKey: QUERY_KEYS.AUTH.PROFILE });
		setSignedIn(false);
	}, [queryClient]);

	const signin = useCallback(
		(accessToken: string) => {
			tokenStorage.set(accessToken);
			queryClient.removeQueries({ queryKey: QUERY_KEYS.AUTH.PROFILE });
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
		if (isProfileError) {
			signout();
		}
	}, [isProfileError, signout]);

	return (
		<AuthContext.Provider value={value}>
			{isProfileFetching && <LoadingScreen />}
			{!isProfileFetching && children}
		</AuthContext.Provider>
	);
}
