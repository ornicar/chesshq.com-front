import React from "react";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faRedoAlt, faClock, faEye } from "@fortawesome/free-solid-svg-icons";

import { getRepertoireNextReview } from "../../../../helpers";
import { GET_REPERTOIRE_CACHED } from "../../../../api/queries";
import { RepertoireModel, RepertoireQueryData } from "../../../../lib/types/models/Repertoire";

interface RepertoireProps {
	id   : RepertoireModel["id"],
	slug : RepertoireModel["slug"],
	name : RepertoireModel["name"]
}

function Repertoire(props: RepertoireProps) {
	const { t } = useTranslation("repertoires");

	const { data } = useQuery<RepertoireQueryData>(
		GET_REPERTOIRE_CACHED,
		{
			variables : {
				slug : props.slug
			},
			nextFetchPolicy : "cache-only"
		}
	);

	const review = getRepertoireNextReview(data?.repertoire?.nextReview);
	const eye    = (data?.repertoire?.public) ? <FontAwesomeIcon icon={faEye} size="xs" className="mr-2"/> : null;

	return (
		<Link to={{ pathname: "/repertoires/" + props.slug }} className="flex">
			<div className="flex pr-2 flex-1 overflow-hidden">
				<span className="overflow-hidden overflow-ellipsis">{eye}{props.name}</span>
			</div>
			<div className="flex flex-initial items-center">
				<FontAwesomeIcon icon={faClock} size="xs" className="mr-1"/>
				{review?.val} {review?.t_key ? t(review.t_key) : null}

				<FontAwesomeIcon icon={faPlus} size="xs" className="ml-2 mr-1"/>
				{data?.repertoire?.lessonQueueLength ?? 0}

				<FontAwesomeIcon icon={faRedoAlt} size="xs" className="ml-2 mr-1"/>
				{data?.repertoire?.reviewQueueLength ?? 0}
			</div>
		</Link>
	)
}

export default Repertoire;