export const ROUTES = {
	"home"              : "/",
	"repertoires"       : "/repertoires/:slug?",
	"lessons"           : "/lessons/:slug?",
	"reviews"           : "/reviews/:slug?",
	"openings_explorer" : "/openings-explorer/",
	"eco_database"      : "/eco-database/:slug?",
	"game_database"     : "/game-database/",
	"collection"        : "/game-database/collection/:collection_slug",
	"collection_game"   : "/game-database/collection/:collection_slug/game/:game_id",
	"master_game"       : "/game-database/master-game/:master_game_id",
	"login"             : "/login/",
	"dashboard"         : "/dashboard/:section",
	"upgrade"           : "/upgrade/"
};

export function generateCanonicalURL(path: string) {
	return process.env.REACT_APP_PUBLIC_URL + path;
}