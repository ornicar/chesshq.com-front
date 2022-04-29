import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { Table } from "antd";
import { useTranslation } from "react-i18next";
import { GET_TRANSPOSITIONS } from "../../../api/queries";
import { EcoPositionModel, EcoTranspositionsQueryData } from "../../../lib/types/models/EcoPosition";

interface TranspositionsProps {
	movelist: string
}

function Transpositions(props: TranspositionsProps) {
	const openings_ref      = React.useRef<EcoPositionModel[]>([]);
	const count_ref         = React.useRef(0);
	const { t }             = useTranslation(["common", "openings"]);
	const [ page, setPage ] = useState(1);
	const { data, loading } = useQuery<EcoTranspositionsQueryData>(GET_TRANSPOSITIONS, {
		variables : {
			limit    : 20,
			page     : page,
			movelist : props.movelist
		}
	});

	if (!loading) {
		openings_ref.current = data?.ecoTranspositions?.openings ?? [];
		count_ref.current    = data?.ecoTranspositions?.length ?? 0;
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

export default Transpositions;