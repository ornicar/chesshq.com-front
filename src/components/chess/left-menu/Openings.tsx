import { useQuery } from "@apollo/client";
import { Table } from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { GET_ECOS } from "../../../api/queries";
import { ChessControllerState } from "../../../lib/types/ChessControllerTypes";
import { EcoPositionModel, EcoPositionsQueryData } from "../../../lib/types/models/EcoPosition";

interface OpeningsProps {
	fen: ChessControllerState["fen"]
	movelist: string
}

function Openings(props: OpeningsProps) {
	const openings_ref      = React.useRef<EcoPositionModel[]>([]);
	const count_ref         = React.useRef(0);
	const { t }             = useTranslation(["common", "openings"]);
	const [ page, setPage ] = useState(1);
	const { data, loading } = useQuery<EcoPositionsQueryData>(GET_ECOS, {
		variables : {
			letter   : "*",
			limit    : 20,
			page     : page,
			filter   : (props.fen !== "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1") ? props.fen : "",
			movelist : props.movelist
		}
	});

	if (!loading) {
		openings_ref.current = data?.ecoPositions?.[0].openings ?? [];
		count_ref.current    = data?.ecoPositions?.[0].length ?? 0;
	}

	return (
		<div className="w-full">
			<Table
				dataSource={openings_ref.current}
				loading={loading}
				rowClassName="cursor-pointer"
				pagination={{ pageSize: 20, onChange: (page: number) => setPage(page), total: count_ref.current, showSizeChanger: false }}
				locale={{
					emptyText : t("common:na")
				}}
				rowKey={(record) => "result-item-" + record.id}
				onRow={(record) => {
					return {
						onClick : () => {
							window.open("/eco-database/" + record.slug, "_blank");
						}
					}
				}}
			>
				<Table.Column title="ECO" dataIndex={"code"}/>
				<Table.Column title={t("openings:opening")} dataIndex={"name"}/>
			</Table>
		</div>
	);
}

export default Openings;