import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChessState } from "../../lib/types/ReduxTypes";

const initialState: ChessState = {
	best_move : "",
	move_id   : null
};

export const ChessSlice = createSlice({
	name: "Chess",
	initialState,
	reducers : {
		setBestMove(state, action: PayloadAction<ChessState["best_move"]>) {
			state.best_move = action.payload;
		},
		setMoveId(state, action: PayloadAction<ChessState["move_id"]>) {
			state.move_id = action.payload;
		},
		setRepertoire(state, action: PayloadAction<ChessState["repertoire"]>) {
			state.repertoire = action.payload;
		},
		setCollection(state, action: PayloadAction<ChessState["collection"]>) {
			state.collection = action.payload;
		}
	}
});

export const { setBestMove, setMoveId, setRepertoire, setCollection } = ChessSlice.actions;

export default ChessSlice.reducer;