import React from "react";
import { useTranslation } from "react-i18next";
import DatabaseDemo from "./home/DatabaseDemo";
import OpeningsDemo from "./home/OpeningsDemo";
import RepertoireDemo from "./home/RepertoireDemo";

import "../styles/components/home.css";
import Header from "./home/Header";

function Home(): JSX.Element {
	const { t } = useTranslation(["repertoires", "database", "openings", "premium"]);

	return (
		<div className="p-6">
			<div className="mb-6">
				<Header/>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-2 gap-6">
				<div className="demo-section md:px-8 py-4">
					<div>
						<h1 className="text-xl text-green-500">{t("repertoires:repertoire_builder")}</h1>
						<p>{t("repertoires:meta_description")}</p>
					</div>
					<div id="repertoire-demo"><RepertoireDemo/></div>
				</div>
				<div className="demo-section md:px-8 py-4">
					<div>
						<h1 className="text-xl text-green-500">{t("database:game_database")}</h1>
						<p>{t("database:meta_description")}</p>
					</div>
					<div><DatabaseDemo/></div>
				</div>
				<div className="demo-section md:px-8 py-4">
					<div>
						<h1 className="text-xl text-green-500">{t("openings:openings_explorer")}</h1>
						<p>{t("openings:meta_description")}</p>
					</div>
					<div><OpeningsDemo/></div>
				</div>
				<div className="demo-section md:px-8 py-4">
					<div>
						<h1 className="text-xl text-green-500">{t("database:game_collections")}</h1>
						<div>{t("database:collection_info")}</div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 py-4">
						<div className="text-5xl flex items-center justify-center text-green-500" style={{fontFamily : "Roboto", filter: "drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.8))"}}>
							PGN
						</div>
						<div className="flex items-center justify-center">
							<img alt="Chess.com" src={process.env.PUBLIC_URL + "/assets/images/third-party/chesscom.png"}/>
						</div>
						<div className="flex items-center justify-center">
							<img alt="Lichess" src={process.env.PUBLIC_URL + "/assets/images/third-party/lichess.png"}/>
						</div>
					</div>
					<div><p className="text-xs italic">* {t("premium:premium_only")}</p></div>
				</div>
			</div>
		</div>
	);
}

export default Home;