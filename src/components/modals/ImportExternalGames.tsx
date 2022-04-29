import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Form, Button, Spin, Select, DatePicker, Alert } from "antd";
import { useQuery } from "@apollo/client";
import { UserSettingsQueryData } from "../../lib/types/models/User";
import { GET_USER_SETTINGS } from "../../api/queries";
import { notifyError } from "../../helpers";
import { Link } from "react-router-dom";

interface ImportExternalGamesProps {
	visible: boolean,
	toggleVisible: (visible: boolean) => void,
	onSubmit: (games: ExternalGameData[]) => void
}

interface ExternalImportFormData {
	sources: string[],
	sides: string[],
	types: string[],
	dates: Array<null | moment.Moment>
}

export interface ExternalGameData {
	source: string,
	sourceId: string,
	pgn: string
}

const GAME_LIMIT = 500;

async function fetchChess(data_holder: ExternalGameData[], username: string, criteria: ExternalImportFormData) {
	let archives = await(await fetch(`https://api.chess.com/pub/player/${username}/games/archives`)).json();

	if (!archives || !archives["archives"]) {
		return;
	}

	const start_date  = criteria.dates?.[0];
	const start_year  = start_date?.year();
	const start_month = start_date?.month();
	const start_time  = start_date?.utc().unix();
	const end_date    = criteria.dates?.[1];
	const end_year    = end_date?.year();
	const end_month   = end_date?.month();
	const end_time    = end_date?.utc().unix();

	archives = archives["archives"].reverse();

	let game_count = 0;

	for (const archive_url of archives) {
		if (game_count >= GAME_LIMIT) {
			break;
		}

		const url_data      = archive_url.split("/");
		const archive_month = +url_data[url_data.length - 1];
		const archive_year  = +url_data[url_data.length - 2];

		if (start_year && start_month) {
			if (archive_year < start_year || (archive_year === start_year && archive_month < start_month)) {
				break;
			}
		}

		if (end_year && end_month) {
			if (archive_year > end_year || (archive_year === end_year && archive_month > end_month)) {
				continue;
			}
		}

		try {
			const archive_data = await(await fetch(archive_url)).json();

			if (!archive_data || !archive_data["games"]) {
				continue;
			}

			const games = archive_data["games"].reverse();

			for (const game of games) {
				if (game_count >= GAME_LIMIT) {
					break;
				}

				if (start_time !== undefined && game["end_time"] < start_time) {
					break;
				}

				if (end_time !== undefined && game["end_time"] > end_time) {
					continue;
				}

				if (criteria.sources && !criteria.types.includes(game["time_class"])) {
					continue;
				}

				if (criteria.sides.length === 1) {
					const side = criteria.sides[0];

					if (game[side]?.["username"].toLowerCase() !== username.toLowerCase()) {
						continue;
					}
				}

				game_count++;
				data_holder.push({
					source   : "chesscom",
					sourceId : game["uuid"],
					pgn      : game["pgn"]
				})
			}
		} catch (e) {
			continue;
		}
	}
}

async function fetchLichess(data_holder: ExternalGameData[], username: string, criteria: ExternalImportFormData) {
	const params = [
		"max=" + GAME_LIMIT,
		"perfType=" + criteria.types.join(","),
	];

	if (criteria.dates?.[0]) {
		params.push("since=" + (criteria.dates[0].utc().unix() * 1000));
	}

	if (criteria.dates?.[1]) {
		params.push("until=" + (criteria.dates[1].utc().unix() * 1000));
	}

	if (criteria.sides && criteria.sides.length > 0) {
		params.push("color=" + criteria.sides.join(","));
	}

	try {
		const data  = await fetch(`https://lichess.org/api/games/user/${username}?` + params.join("&"));
		const body  = data?.body;
		const res   = new Response(body);
		const blob  = await res.blob();
		const games = (await blob.text()).split("\n\n[");

		for (const game of games) {
			const url       = game.match(/\[Site "(https[^\]]+)"\]/);
			const url_parts = (url && url.length > 1) ? url[1].split("/") : false;

			if (!url_parts) {
				continue;
			}

			data_holder.push({
				source   : "lichess",
				sourceId : url_parts[url_parts.length - 1],
				pgn      : game
			});
		}
	} catch (e) {
		return;
	}
}

function ImportExternalGames(props: ImportExternalGamesProps) {
	const { t }                                = useTranslation(["common", "database", "chess", "dashboard"]);
	const loaded_data: Array<ExternalGameData> = [];
	const [ spinning, setSpinning ]            = useState(false);
	const connections                          = {
		chesscom : "",
		lichess  : ""
	};
	const { data, loading } = useQuery<UserSettingsQueryData>(GET_USER_SETTINGS, {
		variables : {
			category : "connections"
		}
	});

	const source_options = [];

	for (const setting of data?.userSettings ?? []) {
		const valid_keys = ["chesscom_username", "lichess_username"];

		if (!valid_keys.includes(setting.key) || !setting.value) {
			continue;
		}

		const name = (setting.key === "chesscom_username") ? "Chess.com" : "Lichess";

		if (setting.key === "chesscom_username") {
			connections.chesscom = setting.value;
		} else {
			connections.lichess = setting.value;
		}

		source_options.push(<Select.Option value={setting.key}>{name}</Select.Option>);
	}

	const onSubmit = (values: ExternalImportFormData) => {
		setSpinning(true);

		const promises = [];

		if (!values.types || values.types.length === 0) {
			values.types = [
				"classical",
				"rapid",
				"blitz",
				"bullet"
			];
		}

		for (const source of values.sources) {
			if (source === "chesscom_username" && connections.chesscom) {
				promises.push(fetchChess(loaded_data, connections.chesscom, values));
			}

			if (source === "lichess_username" && connections.lichess) {
				promises.push(fetchLichess(loaded_data, connections.lichess, values));
			}
		}

		Promise.all(promises).then(() => {
			if (loaded_data.length === 0) {
				return notifyError("no_games_found");
			}

			props.onSubmit(loaded_data);
		}).finally(() => setSpinning(false));
	}

	const has_connection = (source_options.length > 0);

	return (
		<Modal
			title={t("database:import")}
			visible={props.visible}
			onCancel={() => props.toggleVisible(false)}
			footer={[
				<Button type="ghost" onClick={() => props.toggleVisible(false)}>{t("cancel")}</Button>,
				<Button type="default" form="import-external" htmlType="submit">{t("submit")}</Button>
			]}
		>
			<Spin spinning={loading || spinning}>
				{
					has_connection &&
					<>
						<Form
							id="import-external"
							onFinish={onSubmit}
							autoComplete="off"
						>
							<Form.Item
								label={t("database:game_sources")}
								name="sources"
								rules={[ { required: true, message: t("database:input_game_sources")} ]}
							>
								<Select mode="multiple" allowClear>{source_options}</Select>
							</Form.Item>
							<Form.Item
								label={t("database:game_types")}
								name="types"
								rules={[ { required: true, message: t("database:input_game_types")} ]}
							>
								<Select mode="multiple" allowClear>
									<Select.Option value="rapid">{t("chess:rapid")}</Select.Option>
									<Select.Option value="bullet">{t("chess:bullet")}</Select.Option>
									<Select.Option value="blitz">{t("chess:blitz")}</Select.Option>
									<Select.Option value="classical">{t("chess:classical")}</Select.Option>
								</Select>
							</Form.Item>
							<Form.Item
								label={t("chess:side", { plural : "s" })}
								name="sides"
								rules={[ { required: true, message: t("database:input_side")} ]}
							>
								<Select mode="multiple" allowClear>
									<Select.Option value="white">{t("chess:white")}</Select.Option>
									<Select.Option value="black">{t("chess:black")}</Select.Option>
								</Select>
							</Form.Item>
							<Form.Item
								label={t("date_range")}
								name="dates"
							>
								<DatePicker.RangePicker
									allowEmpty={[true, true]}
								/>
							</Form.Item>
						</Form>
						<Alert message={t("database:import_max", { count : GAME_LIMIT })} type="info"/>
					</>
				}
				{
					!has_connection &&
					<Alert message={<Link to="/dashboard/connections">{t("database:missing_connections")}</Link>} type="error"/>
				}
			</Spin>
		</Modal>
	);
}

export default ImportExternalGames;