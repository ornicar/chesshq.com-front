import React from "react";
import { Divider } from "antd";
import { useTranslation } from "react-i18next";
import { EcoVolume } from "../../lib/types/models/EcoPosition";
import OpeningPaginator from "./opening-volume/OpeningPaginator";

interface OpeningVolumeProps {
	volume: EcoVolume,
	filter: string | null
}

function OpeningVolume(props: OpeningVolumeProps) {
	const { t } = useTranslation("chess");

	return (
		<div className="pb-4">
			<Divider orientation="left">{t("eco_" + props.volume.letter.toLowerCase())}</Divider>
			<OpeningPaginator volume={props.volume} filter={props.filter}/>
		</div>
	);
}

export default OpeningVolume;