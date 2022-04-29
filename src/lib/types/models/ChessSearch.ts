export interface ChessSearchResultItemModel {
	slug: string
	name: string
	createdAt: string
	moveCount?: number
	side?: number
	result?: number
	event?: string
	round?: string
}

export interface ChessSearchQueryData {
	chessSearch: ChessSearchResultItemModel[]
}