import { ChessControllerModes } from "./ChessControllerTypes";
import { CollectionModel } from "./models/Collection";
import { RepertoireModel, RepertoireMoveModel } from "./models/Repertoire";

export interface AuthState {
	authenticated : boolean
	uid?          : string
	token?        : string
	tier          : number
}

export interface AuthStateUserPayload {
	uid?: AuthState["uid"]
	token?: AuthState["token"]
}

export interface ChessState {
	best_move   : string
	move_id     : RepertoireMoveModel["id"] | null
	repertoire? : RepertoireModel | null
	collection? : CollectionModel | null  
}

export interface UIState {
	viewing: {
		[key in ChessControllerModes]: string
	},
	mobile: boolean
}