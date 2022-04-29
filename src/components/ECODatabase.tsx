import React, { ChangeEvent, useState } from "react";
import { Input } from "antd";
import { useTranslation } from "react-i18next";
import { EcoPositionsQueryData } from "../lib/types/models/EcoPosition";
import OpeningVolume from "./eco-database/OpeningVolume";

const BLANK_VOLUMES: EcoPositionsQueryData = {
	ecoPositions : []
}

for (const letter of ["A", "B", "C", "D", "E"]) {
	BLANK_VOLUMES.ecoPositions.push({
		letter   : letter,
		length   : 0,
		openings : [],
		fake     : true
	})
}

function ECODatabase(): JSX.Element {
	const [ filter, setFilter ] = useState<string | null>(null);
	const { t }                 = useTranslation(["common", "openings"]);
	const timeout_ref           = React.useRef<NodeJS.Timeout | undefined>(undefined);

	const onFilter = function(e: ChangeEvent<HTMLInputElement>) {		
		if (timeout_ref.current !== undefined) {
			clearTimeout(timeout_ref.current);
		}

		timeout_ref.current = setTimeout(() => setFilter(e.target.value), 500);
	}

	const volumes = [];

	for (const volume of BLANK_VOLUMES.ecoPositions) {
		volumes.push(<OpeningVolume key={"opening-volume-" + volume} volume={volume} filter={filter}/>);
	}

	return (
		<div className="p-6">
			<Input addonBefore={t("filter")} onChange={onFilter} allowClear={true} placeholder={t("openings:filter")}/>
			{volumes}
		</div>
	);
}

export default ECODatabase;