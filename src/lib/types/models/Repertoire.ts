import { UserModel } from "./User";

export interface RepertoireMoveNoteModel {
	id: string,
	value: string | null,
	repertoireMoveId: string
}

export interface RepertoireReviewModel {
	moveId?: string,
	incorrectAttempts: number,
	attempts: number,
	averageCorrectTime: number,
	averageTime: number
}

export interface RepertoireMoveArrowDatumModel {
	id: number
	data: string[]
}

export interface RepertoireMoveModel {
	id: string,
	fen: string,
	uci: string,
	moveNumber: number,
	move: string,
	sort: number,
	arrow?: RepertoireMoveArrowDatumModel,
	parentId?: string | null,
	transpositionId?: string | null,
}

export interface RepertoireQueueItemModel {
	id: string,
	parentId: string | null,
	move: string,
	uci: string,
	movelist: string,
	similarMoves?: string | null
}

export interface RepertoireModel {
	id: number,
	slug?: string,
	name: string,
	side: string,
	public: boolean,
	moves?: Array<RepertoireMoveModel> | null,
	user?: UserModel,
	userOwned: boolean,
	lessonQueueLength?: number,
	lessonQueue?: Array<RepertoireQueueItemModel>,
	reviewQueueLength?: number,
	reviewQueue?: Array<RepertoireQueueItemModel>,
	nextReview?: string | null
}

interface PreviousMoveModel {
	id: RepertoireMoveModel["id"],
	transpositionId: RepertoireMoveModel["transpositionId"]
	sort: RepertoireMoveModel["sort"]
}

export interface RepertoireMoveNoteQueryData {
	repertoireMoveNote: RepertoireMoveNoteModel | null
}

export interface RepertoireMoveDeletionMutationData {
	deleteRepertoireMove : {
		repertoire: RepertoireModel | null,
		previousMoves: Array<PreviousMoveModel> | null,
		errors: Array<string>
	}
}

export interface RepertoireMoveNoteMutationData {
	createRepertoireMoveNote : {
		note: RepertoireMoveNoteModel | null
		errors: Array<string>
	}
}

export interface RepertoireMoveArrowDatumMutationData {
	createRepertoireMoveArrowDatum : {
		move: RepertoireMoveModel | null
		errors: Array<string>
	}
}

export interface RepertoireQueryData {
	repertoire: RepertoireModel | null
}

export interface RepertoireMovesQueryData {
	repertoire: {
		moves: Array<RepertoireMoveModel>
	}
}

export interface RepertoiresQueryData {
	repertoires: Array<RepertoireModel>
}