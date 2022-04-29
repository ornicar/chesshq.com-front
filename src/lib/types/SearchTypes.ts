import { ChessControllerProps } from "./ChessControllerTypes";

export enum SearchModes {
	repertoires = "repertoires",
	master_games = "master_games"
}

export interface SearchProps {
	mode: keyof typeof SearchModes,
	movelist: string,
	record?: ChessControllerProps["game"] | ChessControllerProps["repertoire"],
	onMoveSearchChange?: Function
}

export interface SearchCriteria {
	mode: SearchProps["mode"],
	data: {
		movelist?: string,
		fens?: string[],
		fenSearchType?: string,
		eco?: string,
		pgn?: string,
		side?: string,
		elo?: string,
		eloComparison?: string,
		whiteFirst?: string,
		whiteLast?: string,
		blackFirst?: string,
		blackLast?: string,
	}
}

export interface SearchState {
	criteria?: SearchCriteria
}