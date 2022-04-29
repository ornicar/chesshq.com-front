import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { cable_link } from "../../lib/Apollo";
import { auth } from "../../lib/Firebase";
import { AuthState } from "../../lib/types/ReduxTypes";

const initialState: AuthState = {
	authenticated : false,
	tier          : 0
};

interface LoginPayload {
	uid?: string,
	token?: string
}

export const AuthSlice = createSlice({
	name: "Auth",
	initialState,
	reducers : {
		login(state, action: PayloadAction<LoginPayload>) {
			state.uid           = action.payload.uid
			state.token         = action.payload.token;
			state.authenticated = true;
			
			cable_link.connectionParams = {
				token : state.token ?? ""
			};
		},
		logout(state) {
			state.uid           = undefined;
			state.token         = undefined;
			state.authenticated = false;
			state.tier          = 0;

			auth.signOut();

			cable_link.connectionParams = {
				token : ""
			};
		},
		setTier(state, action: PayloadAction<number>) {
			state.tier = action.payload;
		}
	}
});

export const { login, logout, setTier } = AuthSlice.actions;

export default AuthSlice.reducer;