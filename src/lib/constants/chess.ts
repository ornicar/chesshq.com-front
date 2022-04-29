import { ChessSearchQueryData } from "../types/models/ChessSearch";
import { EcoPositionModel } from "../types/models/EcoPosition";
import { GameModel } from "../types/models/Game";

export const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export const DEMO_MASTER_GAME_RESULTS: ChessSearchQueryData = {
	chessSearch : [
		{
			slug      : "-1",
			name      : "Fischer, R - Spassky, Boris V",
			createdAt : "1972-07-23",
			result    : 1,
			event     : "World Chess Championship 1972",
			round     : "6"
		},
		{
			slug      : "-2",
			name      : "Carlsen, M - Anand, V",
			createdAt : "2013-11-15",
			result    : 1,
			event     : "World Chess Championship 2013",
			round     : "5"
		},
		{
			slug      : "-3",
			name      : "Kasparov, G - Topalov, V",
			createdAt : "1999-01-20",
			result    : 1,
			event     : "Hoogovens",
			round     : "4"
		},
		{
			slug      : "-4",
			name      : "Morphy, P - Duke Karl Count Isouard",
			createdAt : "1858-??-??",
			result    : 1,
			event     : "Paris Opera",
			round     : "?"
		}
	]
};

export const DEMO_MASTER_GAMES: Array<GameModel> = [
	{
		id     : "87237975-48c1-2821-6b28-eb528904cd6d",
		slug   : "-1",
		result : "1-0",
		name   : "Fischer, R - Spassky, Boris V",
		source : "",
		date   : "1972-07-23",
		event  : "World Chess Championship 1972",
		round  : "6",
		white  : "Fischer, R",
		black  : "Spassky, Boris V",
		pgn    : `[Event "FIDE (28) 1970-1972"]
[Site "Reykjavik wch-m"]
[Date "1972.07.23"]
[Round "1"]
[White "Fischer, R."]
[Black "Spassky, Boris V"]
[Result "1-0"]
[BlackElo "2660"]
[ECO "D59n"]
[WhiteElo "2785"]

1. c4 e6 2. Nf3 d5 3. d4 Nf6 4. Nc3 Be7 5. Bg5 O-O 6. e3 h6 7. Bh4 b6 8. cxd5
Nxd5 9. Bxe7 Qxe7 10. Nxd5 exd5 11. Rc1 Be6 12. Qa4 c5 13. Qa3 Rc8 14. Bb5 a6
15. dxc5 bxc5 16. O-O Ra7 17. Be2 Nd7 18. Nd4 Qf8 19. Nxe6 fxe6 20. e4 d4 21.
f4 Qe7 22. e5 Rb8 23. Bc4 Kh8 24. Qh3 Nf8 25. b3 a5 26. f5 exf5 27. Rxf5 Nh7
28. Rcf1 Qd8 29. Qg3 Re7 30. h4 Rbb7 31. e6 Rbc7 32. Qe5 Qe8 33. a4 Qd8 34.
R1f2 Qe8 35. R2f3 Qd8 36. Bd3 Qe8 37. Qe4 Nf6 38. Rxf6 gxf6 39. Rxf6 Kg8 40.
Bc4 Kh8 41. Qf4 1-0`,
		movelist : "c4.e6.Nf3.d5.d4.Nf6.Nc3.Be7.Bg5.OO.e3.h6.Bh4.b6.cxd5.Nxd5.Bxe7.Qxe7.Nxd5.exd5.Rc1.Be6.Qa4.c5.Qa3.Rc8.Bb5.a6.dxc5.bxc5.OO.Ra7.Be2.Nd7.Nd4.Qf8.Nxe6.fxe6.e4.d4.f4.Qe7.e5.Rb8.Bc4.Kh8.Qh3.Nf8.b3.a5.f5.exf5.Rxf5.Nh7.Rcf1.Qd8.Qg3.Re7.h4.Rbb7.e6.Rbc7.Qe5.Qe8.a4.Qd8.R1f2.Qe8.R2f3.Qd8.Bd3.Qe8.Qe4.Nf6.Rxf6.gxf6.Rxf6.Kg8.Bc4.Kh8.Qf4"
	},
	{
		id     : "85a96f1e-6a33-48f2-075c-345c1c2e0cc1",
		slug   : "-2",
		result : "1-0",
		name   : "Carlsen, M - Anand, V",
		source : "",
		date   : "2013-11-15",
		event  : "World Chess Championship 2013",
		round  : "5",
		white  : "Carlsen, M",
		black  : "Anand, V",
		pgn    : `[Event "WCh 2013"]
[Site "Chennai IND"]
[Date "2013.11.15"]
[Round "5"]
[White "Carlsen, Magnus"]
[Black "Anand, Viswanathan"]
[Result "1-0"]
[WhiteTitle "GM"]
[BlackTitle "GM"]
[WhiteElo "2870"]
[BlackElo "2775"]
[ECO "D31"]
[Opening "QGD"]
[Variation "semi-Slav, Marshall gambit"]
[WhiteFideId "1503014"]
[BlackFideId "5000017"]
[EventDate "2013.11.09"]

1. c4 e6 2. d4 d5 3. Nc3 c6 4. e4 dxe4 5. Nxe4 Bb4+ 6. Nc3 c5 7. a3 Ba5 8. Nf3
Nf6 9. Be3 Nc6 10. Qd3 cxd4 11. Nxd4 Ng4 12. O-O-O Nxe3 13. fxe3 Bc7 14. Nxc6
bxc6 15. Qxd8+ Bxd8 16. Be2 Ke7 17. Bf3 Bd7 18. Ne4 Bb6 19. c5 f5 20. cxb6 fxe4
21. b7 Rab8 22. Bxe4 Rxb7 23. Rhf1 Rb5 24. Rf4 g5 25. Rf3 h5 26. Rdf1 Be8 27.
Bc2 Rc5 28. Rf6 h4 29. e4 a5 30. Kd2 Rb5 31. b3 Bh5 32. Kc3 Rc5+ 33. Kb2 Rd8 34.
R1f2 Rd4 35. Rh6 Bd1 36. Bb1 Rb5 37. Kc3 c5 38. Rb2 e5 39. Rg6 a4 40. Rxg5 Rxb3+
41. Rxb3 Bxb3 42. Rxe5+ Kd6 43. Rh5 Rd1 44. e5+ Kd5 45. Bh7 Rc1+ 46. Kb2 Rg1 47.
Bg8+ Kc6 48. Rh6+ Kd7 49. Bxb3 axb3 50. Kxb3 Rxg2 51. Rxh4 Ke6 52. a4 Kxe5 53.
a5 Kd6 54. Rh7 Kd5 55. a6 c4+ 56. Kc3 Ra2 57. a7 Kc5 58. h4 1-0`,
		movelist : "c4.e6.d4.d5.Nc3.c6.e4.dxe4.Nxe4.Bb4.Nc3.c5.a3.Ba5.Nf3.Nf6.Be3.Nc6.Qd3.cxd4.Nxd4.Ng4.OOO.Nxe3.fxe3.Bc7.Nxc6.bxc6.Qxd8.Bxd8.Be2.Ke7.Bf3.Bd7.Ne4.Bb6.c5.f5.cxb6.fxe4.b7.Rab8.Bxe4.Rxb7.Rhf1.Rb5.Rf4.g5.Rf3.h5.Rdf1.Be8.Bc2.Rc5.Rf6.h4.e4.a5.Kd2.Rb5.b3.Bh5.Kc3.Rc5.Kb2.Rd8.R1f2.Rd4.Rh6.Bd1.Bb1.Rb5.Kc3.c5.Rb2.e5.Rg6.a4.Rxg5.Rxb3.Rxb3.Bxb3.Rxe5.Kd6.Rh5.Rd1.e5.Kd5.Bh7.Rc1.Kb2.Rg1.Bg8.Kc6.Rh6.Kd7.Bxb3.axb3.Kxb3.Rxg2.Rxh4.Ke6.a4.Kxe5.a5.Kd6.Rh7.Kd5.a6.c4.Kc3.Ra2.a7.Kc5.h4"
	},
	{
		id     : "d6b449ce-fd85-8929-0d84-f68c7f29436f",
		slug   : "-3",
		result : "1-0",
		name   : "Kasparov, G - Topalov, V",
		source : "",
		date   : "1999-01-20",
		event  : "Hoogovens",
		round  : "4",
		white  : "Kasparov, G",
		black  : "Topalov, V",
		pgn    : `[Event "Hoogovens"]
[Site "Wijk aan Zee NED"]
[Date "1999.01.20"]
[Round "4"]
[White "Kasparov, Garry"]
[Black "Topalov, Veselin"]
[Result "1-0"]
[BlackElo "2700"]
[ECO "B07v"]
[WhiteElo "2812"]

1. e4 d6 2. d4 Nf6 3. Nc3 g6 4. Be3 Bg7 5. Qd2 c6 6. f3 b5 7. Nge2 Nbd7 8. Bh6
Bxh6 9. Qxh6 Bb7 10. a3 e5 11. O-O-O Qe7 12. Kb1 a6 13. Nc1 O-O-O 14. Nb3 exd4
15. Rxd4 c5 16. Rd1 Nb6 17. g3 Kb8 18. Na5 Ba8 19. Bh3 d5 20. Qf4+ Ka7 21. Rhe1
d4 22. Nd5 Nbxd5 23. exd5 Qd6 24. Rxd4 cxd4 25. Re7+ Kb6 26. Qxd4+ Kxa5 27. b4+
Ka4 28. Qc3 Qxd5 29. Ra7 Bb7 30. Rxb7 Qc4 31. Qxf6 Kxa3 32. Qxa6+ Kxb4 33. c3+
Kxc3 34. Qa1+ Kd2 35. Qb2+ Kd1 36. Bf1 Rd2 37. Rd7 Rxd7 38. Bxc4 bxc4 39. Qxh8
Rd3 40. Qa8 c3 41. Qa4+ Ke1 42. f4 f5 43. Kc1 Rd2 44. Qa7 1-0`,
		movelist : "e4.d6.d4.Nf6.Nc3.g6.Be3.Bg7.Qd2.c6.f3.b5.Nge2.Nbd7.Bh6.Bxh6.Qxh6.Bb7.a3.e5.OOO.Qe7.Kb1.a6.Nc1.OOO.Nb3.exd4.Rxd4.c5.Rd1.Nb6.g3.Kb8.Na5.Ba8.Bh3.d5.Qf4.Ka7.Rhe1.d4.Nd5.Nbxd5.exd5.Qd6.Rxd4.cxd4.Re7.Kb6.Qxd4.Kxa5.b4.Ka4.Qc3.Qxd5.Ra7.Bb7.Rxb7.Qc4.Qxf6.Kxa3.Qxa6.Kxb4.c3.Kxc3.Qa1.Kd2.Qb2.Kd1.Bf1.Rd2.Rd7.Rxd7.Bxc4.bxc4.Qxh8.Rd3.Qa8.c3.Qa4.Ke1.f4.f5.Kc1.Rd2.Qa7"
	},
	{
		id     : "15a5e6a0-9309-4a00-5b9b-0162827d3902",
		slug   : "-4",
		result : "1-0",
		name   : "Morphy, P - Duke Karl Count Isouard",
		source : "",
		date   : "1858-??-??",
		event  : "Paris Opera",
		round  : "?",
		white  : "Morphy, P",
		black  : "Duke Karl Count Isouard",
		pgn    : `[Event "Paris it"]
[Site "Paris FRA"]
[Date "1858.??.??"]
[Round "?"]
[White "Morphy, Paul"]
[Black "Duke Karl Count Isouard"]
[Result "1-0"]
[ECO "C41c"]

1. e4 e5 2. Nf3 d6 3. d4 Bg4 4. dxe5 Bxf3 5. Qxf3 dxe5 6. Bc4 Nf6 7. Qb3 Qe7 8.
Nc3 c6 9. Bg5 b5 10. Nxb5 cxb5 11. Bxb5+ Nbd7 12. O-O-O Rd8 13. Rxd7 Rxd7 14.
Rd1 Qe6 15. Bxd7+ Nxd7 16. Qb8+ Nxb8 17. Rd8# 1-0`,
		movelist : "e4.e5.Nf3.d6.d4.Bg4.dxe5.Bxf3.Qxf3.dxe5.Bc4.Nf6.Qb3.Qe7.Nc3.c6.Bg5.b5.Nxb5.cxb5.Bxb5.Nbd7.OOO.Rd8.Rxd7.Rxd7.Rd1.Qe6.Bxd7.Nxd7.Qb8.Nxb8.Rd8"
	}
];

export const DEMO_OPENING_RESULT: { ecoPositions: EcoPositionModel[] } = {
	ecoPositions : [
		{
			id   : 9044,
			code : "C51",
			name : "Italian Game: Evans Gambit",
			slug : "c51-italian-game-evans-gambit-016f",
			fen  : "r1bqk1nr/pppp1ppp/2n5/2b1p3/1PB1P3/5N2/P1PP1PPP/RNBQK2R b KQkq -",
			pgn  : "1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. b4"
		},
		{
			id   : 7782,
			code : "B10",
			name : "Caro-Kann Defense",
			slug : "b10-caro-kann-defense-1358",
			fen  : "rnbqkbnr/pp2pppp/2p5/3p4/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq -",
			pgn  : "1. e4 c6 2. Nc3 d5"
		}
	]
};