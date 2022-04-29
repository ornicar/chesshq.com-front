import { configureStore } from "@reduxjs/toolkit";
import auth from "./slices/auth";
import chess from "./slices/chess";
import ui from "./slices/ui";

const store = configureStore({
	reducer : {
		Auth  : auth,
		Chess : chess,
		UI    : ui
	}
});

export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;