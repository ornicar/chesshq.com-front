import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence, User } from "firebase/auth";

import store from "../redux/store";
import { login, logout, setTier } from "../redux/slices/auth";
import { CREATE_USER } from "../api/queries";
import { notifyError } from "../helpers";
import { client } from "./Apollo";
import { CreateUserMutationData } from "./types/models/User";

const app = initializeApp({
	apiKey            : process.env.REACT_APP_FIREBASE_KEY,
	authDomain        : process.env.REACT_APP_FIREBASE_DOMAIN,
	projectId         : process.env.REACT_APP_FIREBASE_PROJECT,
	storageBucket     : process.env.REACT_APP_FIREBASE_BUCKET,
	messagingSenderId : process.env.REACT_APP_FIREBASE_SENDER,
	appId             : process.env.REACT_APP_FIREBASE_APP,
	measurementId     : process.env.REACT_APP_FIREBASE_MEASUREMENT
});

export const auth = getAuth(app);

const serverLogin = (user: User | any, type: string) => {
	client
		.mutate<CreateUserMutationData>({
			mutation       : CREATE_USER,
			refetchQueries : "active",
			variables : {
				email : user.email,
				uid   : user.uid,
				type  : type
			}
		})
		.then((res) => {
			// All good
			localStorage.setItem("firebase_uid", user.uid);
			localStorage.setItem("firebase_token", user.accessToken);
			store.dispatch(setTier(res.data?.createUser.user.tier ?? 0));
		})
		.catch((err) => {
			if (type === "auth") {
				auth.signOut();
				notifyError();
				
				if (process.env.NODE_ENV === "development") {
					console.error(err);
				}
			}
		});
};

function FirebaseAuth() {
	const handleAuth = (res: User | any | null, from_ui?: boolean) => {
		const user = (from_ui) ? res.user : res;

		if (!user) {
			store.dispatch(logout());
			return false;
		}

		store.dispatch(login({
			uid   : user.uid,
			token : user.accessToken
		}));
		serverLogin(user, "auth");
	};

	const handleTokenChange = (user: User | any | null) => {
		if (!user) {
			return;
		}

		store.dispatch(login({
			uid   : user.uid,
			token : user.accessToken
		}));
		serverLogin(user, "token");
		localStorage.setItem("firebase_uid", user.uid);
		localStorage.setItem("firebase_token", user.accessToken);
	}

	auth.onAuthStateChanged(handleAuth);
	auth.onIdTokenChanged(handleTokenChange);

	setPersistence(auth, browserLocalPersistence)
		.catch((err) => {
			console.error(err);
		});
}

export default FirebaseAuth;