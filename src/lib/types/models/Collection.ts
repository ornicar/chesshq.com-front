import { UserModel } from "./User";
import { GameModel } from "./Game";

export interface CollectionModel {
	id: number,
	slug?: string,
	name: string,
	side: string,
	public: boolean,
	gameCount: number,
	games?: Array<GameModel> | null,
	user?: UserModel
	userOwned: boolean
}

export interface CollectionQueryData {
	collection: CollectionModel | null
}

export interface CollectionsQueryData {
	collections: Array<CollectionModel>
}

export interface SaveMasterGameMutationData {
	saveMasterGame: {
		collection: CollectionModel | null,
		errors: string[]
	}
}