import React, { useState } from "react";
import { Empty, Pagination, Spin } from "antd";
import { Link } from "react-router-dom";
import { EcoPositionsQueryData, EcoVolume } from "../../../lib/types/models/EcoPosition";
import Chessboard from "../../Chessboard";
import { useTranslation } from "react-i18next";
import { useQuery } from "@apollo/client";
import { GET_ECOS } from "../../../api/queries";

interface OpeningPaginatorProps {
	volume: EcoVolume,
	filter: string | null
}

const PAGE_SIZE = 20;

function OpeningPaginator(props: OpeningPaginatorProps): JSX.Element {
	const { t }                 = useTranslation("common");
	const [ page, setPage ]     = useState(1);
	let   boards: JSX.Element[] = [];
	const prev_boards           = React.useRef<JSX.Element[]>([]);
	const length_ref            = React.useRef(0);
	const { data, loading }     = useQuery<EcoPositionsQueryData>(GET_ECOS, {
		variables : {
			letter   : props.volume.letter,
			page     : page,
			limit    : PAGE_SIZE,
			filter   : props.filter,
			movelist : null
		}
	});

	if (loading) {
		boards = prev_boards.current
	} else {
		for (const opening of data?.ecoPositions[0].openings ?? []) {
			boards.push(
				<Link key={"opening-link-" + opening.id} type="div" className="board-100w" to={"/eco-database/" + opening.slug}>
					<h1 style={{ height : "44px", maxHeight : "44px", WebkitLineClamp : 2, WebkitBoxOrient : "vertical", display: "-webkit-box" }} className="overflow-ellipsis overflow-hidden">
						{opening.code}: {opening.name}
					</h1>
					<Chessboard
						key={"opening-" + opening.id}
						mode="static"
						fen={opening.fen}
						pgn={opening.pgn}
						onMove={() => ""}
						children={[]}
						queue_item={undefined}
						quizzing={false}
					/>
				</Link>
			);
		}

		prev_boards.current = boards;
		length_ref.current  = data?.ecoPositions[0].length ?? 0;
	}

	const onPage = (page: number): void => {
		setPage(page);
	};

	if (!boards.length && !loading) {
		return (<Empty description={t("na")} image={Empty.PRESENTED_IMAGE_SIMPLE}/>);
	}

	return (
		<Spin spinning={loading}>
			<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 3xl:grid-cols-12 gap-4">
				{boards}
			</div>
			<div className="mt-4">
				<Pagination current={page} total={length_ref.current} pageSize={PAGE_SIZE} onChange={onPage} showSizeChanger={false}/>
			</div>
		</Spin>
	);
}

export default OpeningPaginator;