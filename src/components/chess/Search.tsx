import React, { useEffect, useRef, useState } from "react";
import { Form, Input, Tabs, Select, Button } from "antd";
import { useTranslation } from "react-i18next";
import { useQuery } from "@apollo/client";

import { GET_ECOS } from "../../api/queries";
import { EcoPositionsQueryData } from "../../lib/types/models/EcoPosition";
import { SearchCriteria, SearchProps, SearchState } from "../../lib/types/SearchTypes";

import Results from "./search/Results";
import { RootState } from "../../redux/store";
import { connect, ConnectedProps } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle, faPlus } from "@fortawesome/free-solid-svg-icons";

const formItemLayout = {
	labelCol: {
		xs: { span: 24 },
		sm: { span: 2 },
	},
	wrapperCol: {
		xs: { span: 24 },
		sm: { span: 24 },
	},
};

const formItemLayoutWithOutLabel = {
	wrapperCol: {
		xs: { span: 24, offset: 0 },
		sm: { span: 24, offset: 2 },
	},
};

function Search(props: SearchProps & PropsFromRedux) {
	const [ form ] = Form.useForm();
	const [ active_tab, setActiveTab ] = useState<string>("form");
	const [ state, setState ] = useState<SearchState>({
		criteria : undefined
	});
	const [ move_searching, setMoveSearching ] = useState<boolean>(false);
	const { t } = useTranslation(["search", "chess", "common"]);
	const { data } = useQuery<EcoPositionsQueryData>(GET_ECOS, {
		variables : {
			letter   : "all",
			limit    : 999999,
			page     : 1,
			filter   : null,
			movelist : null
		}
	});
	const prev_movelist = useRef<string>();

	useEffect(
		() => {
			if (move_searching && prev_movelist.current !== props.movelist) {
				prev_movelist.current = props.movelist;

				if (props.movelist) {
					setState({
						criteria : {
							mode : props.mode,
							data : {
								movelist : props.movelist
							}
						}
					});
				}
			}
		},
		[ move_searching, props.movelist, props.mode ]
	);

	function onSubmit(data: SearchCriteria["data"]) {
		if (data.eloComparison === undefined) {
			data.eloComparison = "gte";
		}

		if (data.fenSearchType === undefined) {
			data.fenSearchType = "or";
		}

		setState({
			criteria: {
				mode : props.mode,
				data : data
			}
		});
	}

	function onMoveSearchClick() {
		const new_state = !move_searching;

		setMoveSearching(new_state);
		props.onMoveSearchChange?.(new_state);
	}

	function onTabChange(active: string) {
		setActiveTab(active);

		if (active !== "moves" && move_searching) {
			onMoveSearchClick();
		}
	}

	function onResultClick() {
		if (move_searching) {
			onMoveSearchClick();
		}
	}

	const eco_options = [];

	if (active_tab === "form" && data?.ecoPositions) {
		for (const volume of data.ecoPositions) {
			for (const eco of volume.openings) {
				const title = eco.code + ": " + eco.name;

				eco_options.push(
					<Select.Option value={eco.id} key={"search-eco-" + eco.id} title={title}>{title}</Select.Option>
				);
			}
		}
	}

	return (
		<>
			<Tabs activeKey={active_tab} onChange={onTabChange} key="search-tabs">
				<Tabs.TabPane tab={t("by_criteria")} key="form">
					{
						active_tab === "form" &&
						<Form onFinish={onSubmit} key="search-form" form={form}>
							<Form.List
								name="fens"
								initialValue={[""]}
							>
								{(fields, { add, remove }) => (
									<>
										{fields.map((field, index) => (
											<Form.Item
												{...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
												label={(index === 0) ? "FEN" : ""}
												required={false}
												key={field.key}
											>
												<Form.Item {...field} noStyle>
													<Input autoComplete="off" style={{ width: (index > 0) ? "calc(100% - 14px - 0.5rem" : "100%" }}/>
												</Form.Item>

												{
													index > 0 &&
													<FontAwesomeIcon className="ml-2 cursor-pointer" icon={faMinusCircle} onClick={() => remove(field.name)}/>
												}
											</Form.Item>
										))}

										{
											props.authenticated &&
											props.tier >= 3 &&
											props.mode === "master_games" &&
											<Form.Item {...formItemLayoutWithOutLabel}>
												<Button type="dashed" onClick={() => add()} className="mr-2">
													<FontAwesomeIcon icon={faPlus} className="mr-2"/>
													{t("common:add_item", { item: "FEN" })}
												</Button>
											</Form.Item>
										}
									</>
								)}
							</Form.List>
							<Form.Item label="ECO" name="eco" key="search-eco-item">
								<Select
									key="search-eco-select"
									showSearch
									allowClear={true}
									filterOption={(input, option) => option?.title.toLowerCase().indexOf(input.toLowerCase()) !== -1}
								>
									{eco_options}
								</Select>
							</Form.Item>
							{props.mode === "repertoires" &&
								<Form.Item label={t("chess:side")} name="side" key="search-side-item">
									<Select allowClear={true} key="search-side-select">
										<Select.Option value="white">{t("chess:white")}</Select.Option>
										<Select.Option value="black">{t("chess:black")}</Select.Option>
									</Select>
								</Form.Item>
							}
							{props.mode === "master_games" &&
								<>
									<Form.Item label="Elo" name="elo" key="search-elo-item">
										<Input
											addonBefore={
												<Form.Item noStyle={true} name="eloComparison" key="search-eloComparison-item">
													<Select defaultValue="gte">
														<Select.Option value="gte">&gt;=</Select.Option>
														<Select.Option value="lte">&lt;=</Select.Option>
														<Select.Option value="eq">=</Select.Option>
													</Select>
												</Form.Item>
											}
											maxLength={4}
											autoComplete="off"
										/>
									</Form.Item>

									{
										props.authenticated &&
										props.tier >= 1 &&
										<>
											<div className="grid grid-cols-2 gap-x-2">
												<Form.Item label={t("chess:white")} name="whiteLast" key="search-whiteLast-item">
													<Input placeholder={t("last_name")} autoComplete="off"/>
												</Form.Item>
												<Form.Item name="whiteFirst" key="search-whiteFirst-item">
													<Input placeholder={t("first_name")} autoComplete="off"/>
												</Form.Item>
											</div>
											<div className="grid grid-cols-2 gap-x-2">
												<Form.Item label={t("chess:black")} name="blackLast" key="search-blackLast-item">
													<Input placeholder={t("last_name")} autoComplete="off"/>
												</Form.Item>
												<Form.Item name="blackFirst" key="search-blackFirst-item">
													<Input placeholder={t("first_name")} autoComplete="off"/>
												</Form.Item>
											</div>
											<div className="grid grid-cols-4 gap-x-2">
												<Form.Item label={t("common:date")} name="year" key="search-year-item" className="col-span-2">
													<Input placeholder={t("year")} autoComplete="off" maxLength={4}/>
												</Form.Item>
												<Form.Item name="month" key="search-month-item">
													<Input placeholder={t("month")} autoComplete="off" maxLength={2}/>
												</Form.Item>
												<Form.Item name="day" key="search-day-item">
													<Input placeholder={t("common:day")} autoComplete="off" maxLength={2}/>
												</Form.Item>
											</div>
										</>
									}

									{
										props.authenticated &&
										props.tier >= 3 &&
										<Form.Item label="PGN" name="pgn">
											<Input.TextArea autoSize={{ maxRows: 6, minRows: 2 }}/>
										</Form.Item>
									}
								</>
							}
							<Form.Item>
								<Button type="ghost" htmlType="submit">{t("search")}</Button>
							</Form.Item>
						</Form>
					}
				</Tabs.TabPane>
				<Tabs.TabPane tab={t("by_move_input")} key="moves">
					<p>{t("move_input_prompt")}</p>
					<p><Button type="ghost" onClick={onMoveSearchClick}>{move_searching ? t("stop_searching") : t("start_searching")}</Button></p>
				</Tabs.TabPane>
			</Tabs>
			<Results criteria={state.criteria} mode={props.mode} onResultClick={onResultClick} record={props.record}/>
		</>
	);
}

const mapStateToProps = (state: RootState) => ({
	authenticated : state.Auth.authenticated,
	tier          : state.Auth.tier
});
const connector     = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Search);