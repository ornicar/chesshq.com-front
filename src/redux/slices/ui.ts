import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UIState } from "../../lib/types/ReduxTypes";

const initialState: UIState = {
	viewing : {
		repertoire : "",
		review     : "",
		lesson     : "",
		opening    : "",
		explorer   : "",
		database   : "",
		static     : "",
		search     : ""
	},
	mobile : false
};

interface ViewingPayload {
	key: keyof UIState["viewing"],
	value: string
}

export const UISlice = createSlice({
	name: "UI",
	initialState,
	reducers : {
		setViewing(state, action: PayloadAction<ViewingPayload>) {
			state.viewing[action.payload.key] = action.payload.value;
		},
		setMobile(state, action: PayloadAction<UIState["mobile"]>) {
			state.mobile = action.payload;
		}
	}
});

export const { setViewing, setMobile } = UISlice.actions;

export default UISlice.reducer;