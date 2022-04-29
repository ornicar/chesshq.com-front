import React from "react";
import { Table } from "antd";
import { useQuery } from "@apollo/client";
import { GET_CHESS_SEARCH } from "../../../api/queries";
import { ChessSearchQueryData, ChessSearchResultItemModel } from "../../../lib/types/models/ChessSearch";
import { SearchProps, SearchState } from "../../../lib/types/SearchTypes";

import RepertoireItem from "./RepertoireItem";
import { useHistory } from "react-router";
import MasterGameItem from "./MasterGameItem";
import { useTranslation } from "react-i18next";
import { DEMO_MASTER_GAME_RESULTS } from "../../../lib/constants/chess";
import { hasPremiumLockoutError } from "../../../helpers";
import PremiumWarning from "../../PremiumWarning";

interface ResultsProps {
	criteria: SearchState["criteria"],
	demo?: boolean,
	mode: SearchProps["mode"],
	record?: SearchProps["record"],
	onResultClick: Function
}

function Results(props: ResultsProps) {
	const history                  = useHistory();
	const { t }                    = useTranslation(["chess", "common"]);
	let { loading, data, error }   = useQuery<ChessSearchQueryData>(
		GET_CHESS_SEARCH,
		{
			variables : {
				criteria : props.criteria
			},
			skip : !props.criteria?.mode || props.demo
		}
	);

	if (!props.criteria && !props.demo) {
		return <></>;
	}

	if (props.demo) {
		loading = false;
		data    = DEMO_MASTER_GAME_RESULTS;
		error   = undefined
	}

	const premium = hasPremiumLockoutError(error) ? <PremiumWarning type="modal"/> : null;

	return (
		<div className="w-full">
			{premium}
			<Table
				dataSource={data?.chessSearch}
				loading={loading}
				pagination={(!props.demo) ? { defaultPageSize : 10 } : false}
				rowClassName="cursor-pointer"
				showHeader={props.mode === "master_games" && !props.demo}
				locale={{
					emptyText : t("common:na")
				}}
				rowKey={(record) => "result-item-" + record.slug}
				onRow={(record) => {
					return {
						className : ([props.record?.id, props.record?.slug].includes(record.slug)) ? "active-border relative" : "",
						onClick   : () => {
							props.onResultClick(record.slug);

							if (!props.demo) {
								if (props.mode === "repertoires") {
									history.push("/repertoires/" + record.slug);
								} else if (props.mode === "master_games") {
									history.push("/game-database/master-game/" + record.slug);
								}
							}
						}
					}
				}}
			>
				<Table.Column
					title={t("match")}
					defaultSortOrder={"descend"}
					sorter={{ compare : (a: ChessSearchResultItemModel, b: ChessSearchResultItemModel) => a.createdAt > b.createdAt ? 1 : -1 }}
					render={(text, record: any) => {
						return (props.mode === "repertoires")
							? <RepertoireItem record={record}/>
							: <MasterGameItem record={record}/>;
					}}
				/>
				{
					props.mode === "master_games" &&
					!props.demo &&
					<Table.Column
						title={t("result")}
						dataIndex="result"
						filters={[
							{
								text  : "1-0",
								value : 1
							},
							{
								text  : "0-1",
								value : 0
							},
							{
								text  : "1/2-1/2",
								value : 2
							}
						]}
						onFilter={(value, record: ChessSearchResultItemModel) => record.result === value}
						render={(text, record: ChessSearchResultItemModel) => {
							return (record.result === 0)
								? "0-1"
								: ((record.result === 1)
									? "1-0"
									: ((record.result === 2)
										? "1/2-1/2"
										: "N/A"));
						}}
					/>
				}
			</Table>
		</div>
	);
}

export default Results;