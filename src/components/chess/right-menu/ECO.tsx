import React from "react";
import { Input } from "antd";
import { useQuery } from "@apollo/client";
import { GET_FEN_ECO } from "../../../api/queries";
import { ChessControllerLocalState } from "../../../lib/types/ChessControllerTypes";
import { FenEcoQueryData } from "../../../lib/types/models/EcoPosition";
import { useTranslation } from "react-i18next";

interface ECOProps {
	history: ChessControllerLocalState["fen_history"]
}

function ECO(props: ECOProps) {
	const { t } = useTranslation("common");
	const fens = props.history.map((x) => x.fen);
	const { data } = useQuery<FenEcoQueryData>(
		GET_FEN_ECO,
		{
			variables : {
				fens : fens
			},
			skip : !fens.length
		}
	);

	const na_string = t("na");

	return <Input className="mt-2" addonBefore="ECO" value={!data?.fenEco ? na_string : data?.fenEco.code + ": " + data?.fenEco.name}/>;
}

export default ECO;