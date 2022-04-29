import React from "react";
import { PlanModel } from "../lib/types/models/Premium";
import Plan from "./upgrade/Plan";

import "../styles/components/upgrade.css";

const PLANS: Array<PlanModel> = [
	{
		id            : "free",
		price_monthly : 0,
		price_yearly  : 0,
		tiers         : [0],
		available     : true,
		piece         : "white p",
		features      : [
			{
				text : {
					key : "repertoires:repertoires"
				},
				limits : [
					{
						key     : "repertoire_limit",
						options : {
							count: 2500
						}
					}
				]
			},
			{
				text : {
					key     : "opening_database_limit",
					options : {
						count : 5
					}
				}
			},
			{
				text : {
					key : "Stockfish 14 NNUE"
				}
			},
			{
				text   : {
					key : "repertoires:public_repertoires"
				},
				limits : [
					{
						key : "common:view"
					},
					{
						key     : "public_repertoires_copy_limit",
						options : {
							count : 5
						}
					}
				]
			},
			{
				text   : {
					key : "database:game_collections"
				},
				limits : [
					{
						key : "database:import_pgn"
					},
					{
						key     : "game_collections_limit",
						options : {
							count : 5
						}
					},
					{
						key     : "game_collections_game_limit",
						options : {
							count : 100
						}
					}
				]
			},
			{
				text   : {
					key : "database:game_database"
				},
				limits : [
					{
						key     : "database_result_limit",
						options : {
							count : 25
						}
					},
					{
						key : "search:search_by_opening"
					},
					{
						key : "search:search_by_move_input"
					},
					{
						key : "search:search_by_fen"
					},
					{
						key : "search:search_by_elo"
					}
				]
			}
		]
	},
	{
		id            : "bishop",
		price_monthly : 2.99,
		price_yearly  : 29.99,
		tiers         : [1, 2],
		available     : true,
		piece         : "black b",
		features      : [
			{
				text : {
					key : "repertoires:repertoires"
				},
				limits : [
					{
						key     : "repertoire_limit",
						options : {
							count: 10000
						}
					}
				]
			},
			{
				text : {
					key     : "opening_database_limit",
					options : {
						count : 30
					}
				}
			},
			{
				text   : {
					key : "repertoires:public_repertoires"
				},
				limits : [
					{
						key     : "public_repertoires_copy_limit",
						options : {
							count : 10
						}
					}
				]
			},
			{
				text   : {
					key : "database:game_collections"
				},
				limits : [
					{
						key : "database:save_database_games"
					},
					{
						key     : "game_collections_limit",
						options : {
							count : 100
						}
					},
					{
						key     : "game_collections_game_limit",
						options : {
							count : 1000
						}
					}
				]
			},
			{
				text   : {
					key : "database:game_database"
				},
				limits : [
					{
						key     : "database_result_limit",
						options : {
							count : 100
						}
					},
					{
						key : "search:search_by_player"
					},
					{
						key : "search:search_by_date"
					},
					{
						key : "database:download_pgn"
					}
				]
			}
		]
	},
	{
		id            : "rook",
		price_monthly : 5.99,
		price_yearly  : 54.99,
		tiers         : [3, 4],
		available     : true,
		piece         : "white r",
		features      : [
			{
				text : {
					key : "repertoires:repertoires"
				},
				limits : [
					{
						key     : "repertoire_limit",
						options : {
							count: 30000
						}
					}
				]
			},
			{
				text : {
					key     : "opening_database_limit",
					options : {
						count : -1
					}
				}
			},
			{
				text   : {
					key : "repertoires:public_repertoires"
				},
				limits : [
					{
						key     : "public_repertoires_copy_limit",
						options : {
							count : 25
						}
					}
				]
			},
			{
				text   : {
					key : "database:game_collections"
				},
				limits : [
					{
						key : "database:manual_api_import"
					},
					{
						key     : "game_collections_limit",
						options : {
							count : 500
						}
					},
					{
						key     : "game_collections_game_limit",
						options : {
							count : 2000
						}
					},
					{
						key : "database:download_pgn"
					}
				]
			},
			{
				text   : {
					key : "database:game_database"
				},
				limits : [
					{
						key     : "database_result_limit",
						options : {
							count : 1000
						}
					},
					{
						key : "search:search_by_multiple_fen"
					},
					{
						key : "search:search_by_pgn"
					}
				]
			}
		]
	},
	{
		id            : "monarch",
		price_monthly : 8.99,
		price_yearly  : 79.99,
		tiers         : [5, 6],
		available     : false,
		piece         : "black q",
		features      : [
			{
				text : {
					key : "repertoires:repertoires"
				},
				limits : [
					{
						key     : "repertoire_limit",
						options : {
							count: "∞"
						}
					}
				]
			},
			{
				text   : {
					key : "repertoires:public_repertoires"
				},
				limits : [
					{
						key     : "public_repertoires_copy_limit",
						options : {
							count : "∞"
						}
					}
				]
			},
			{
				text   : {
					key : "database:game_collections"
				},
				limits : [
					{
						key : "database:automatic_api_import"
					},
					{
						key     : "game_collections_limit",
						options : {
							count : "∞"
						}
					},
					{
						key     : "game_collections_game_limit",
						options : {
							count : -1
						}
					}
				]
			}
		]
	}
];

function Upgrade(): JSX.Element {
	const plans = [];

	for (const plan of PLANS) {
		plans.push(
			<Plan key={"plan-" + plan.id} plan={plan}/>
		)
	}

	return (
		<div id="upgrade" className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			{plans}
			<div className="col-span-1 md:col-span-2 lg:col-span-4 opacity-70">
				<img src={process.env.PUBLIC_URL + "/assets/images/third-party/stripe.svg"} className="block m-auto" style={{ maxWidth: "130px" }}/>
			</div>
		</div>
	);
}

export default Upgrade;