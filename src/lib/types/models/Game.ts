export interface GameMoveNoteModel {
	id: string,
	value: string | null
}

export interface GameMoveModel {
	id: string,
	ply: number,
	move: string,
	fen: string,
	uci: string | null
}

export interface GameModel {
	id: string,
	slug: string,
	white: string,
	black: string,
	result: string,
	name: string,
	date: string,
	pgn: string,
	movelist: string,
	source: string,
	event: string,
	round: string,
	moves?: Array<GameMoveModel> | null,
	fen?: undefined
}

export interface GameQueryData {
	game: GameModel | null
}