export interface EcoPositionModel {
	id: number,
	slug: string,
	fen: string,
	pgn: string,
	code: string,
	name: string

	white?: string
	black?: string
}

export interface EcoVolume {
	letter: string,
	length: number,
	openings: EcoPositionModel[],
	fake?: boolean
}

export interface FenEcoQueryData {
	fenEco: EcoPositionModel
}

export interface EcoPositionQueryData {
	ecoPosition: EcoPositionModel
}

export interface EcoPositionsQueryData {
	ecoPositions: Array<EcoVolume>
}

export interface EcoTranspositionsQueryData {
	ecoTranspositions: {
		length: number,
		openings: EcoPositionModel[]
	}
}