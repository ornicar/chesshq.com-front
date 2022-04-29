import Chess, { ChessInstance } from "chess.js";

type ChessType = (fen?: string) => ChessInstance;

const ChessImport = Chess as unknown;
const Chess2      = ChessImport as ChessType;

class ChessMaker {
	create() {
		return Chess2();
	}
}

export default new ChessMaker();