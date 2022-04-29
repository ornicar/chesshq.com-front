import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";

function Footer() {
	const { t } = useTranslation(["common", "repertoires", "openings", "database", "premium"]);

	const years = [2021];
	const year  = (new Date()).getFullYear();

	if (year > years[0]) {
		years.push(year);
	}

	return (
		<div className="bg-gray-800 h-8 absolute -bottom-16 w-full mt-8 flex justify-center items-center text-center">
			<div className="grid grid-cols-none md:grid-flow-col gap-x-4 text-gray-500 text-2xs md:text-xs">
				<div className="col-span-6 md:col-span-1">Copyright &copy; {years.join("-")} Chess HQ, LLC</div>
				<div>
					<Link to="/repertoires/" className="text-gray-400">{t("repertoires:repertoires")}</Link>
				</div>
				<div>
					<Link to="/openings-explorer/" className="text-gray-400">{t("openings:openings_explorer")}</Link>
				</div>
				<div>
					<Link to="/eco-database/" className="text-gray-400">{t("openings:eco_database")}</Link>
				</div>
				<div>
					<Link to="/game-database/" className="text-gray-400">{t("database:game_database")}</Link>
				</div>
				<div>
					<Link to="/upgrade/" className="text-gray-400">{t("premium:upgrade")}</Link>
				</div>
				<div>
					<a href="https://twitter.com/ChessHQcom" target="_blank" className="text-gray-400"><FontAwesomeIcon icon={faTwitter}/></a>
				</div>
			</div>
		</div>
	);
}

export default Footer;