import { LoadingScreen } from "@/components/loading-screen";
import { env } from "@/config/environment";
import { tokenStorage } from "@/storage/token-storage";
import qs from "qs";
import {
	createContext,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";

type Profile = {
	name: string;
	email: string;
	id: string;
	picture: string;
};

export interface IAuthContextValue {
	signedIn: boolean;
	signInWithGoogle: () => void;
	signout: () => void;
	user: Profile;
}

export const AuthContext = createContext({} as IAuthContextValue);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [signedIn, setSignedIn] = useState<boolean>(() => {
		const storageAccessToken = tokenStorage.get();

		return !!storageAccessToken;
	});

	// const queryClient = useQueryClient();

	// const { data, isFetching, isSuccess, isError } = useQuery({
	//   queryKey: QUERY_KEYS.PROFILE,
	//   queryFn: authServices.profile,
	//   enabled: signedIn,
	//   staleTime: Number.POSITIVE_INFINITY,
	// });

	const isError = false;
	const isFetching = false;
	const data = {
		name: "John Doe",
		email: "john.doe@example.com",
		id: "123",
		picture: "https://example.com/picture.jpg",
	};
	const isSuccess = true;

	const signInWithGoogle = useCallback(() => {
		const CLIENT_ID = env.VITE_AUTH_GOOGLE_ID;
		const baseURL = "https://accounts.google.com/o/oauth2/auth";
		const options = qs.stringify({
			client_id: CLIENT_ID,
			redirect_uri: env.VITE_AUTH_REDIRECT_URI,
			response_type: "code",
			scope: "email profile",
		});
		setSignedIn(true);
		window.location.href = `${baseURL}?${options}`;
	}, []);

	const signout = useCallback(() => {
		tokenStorage.remove();
		// queryClient.invalidateQueries({
		//   queryKey: QUERY_KEYS.PROFILE,
		// });
		setSignedIn(false);
	}, []);

	const value = useMemo<IAuthContextValue>(
		() => ({
			signedIn: isSuccess && signedIn,
			signInWithGoogle,
			signout,
			user: {
				name: data?.name || "",
				email: data?.email || "",
				id: data?.id || "",
				picture: data?.picture || "",
			},
		}),
		[signedIn, signInWithGoogle, signout],
	);

	useEffect(() => {
		if (isError) {
			signout();
		}
	}, [signout]);

	return (
		<AuthContext.Provider value={value}>
			{isFetching && <LoadingScreen />}
			{!isFetching && children}
		</AuthContext.Provider>
	);
}
