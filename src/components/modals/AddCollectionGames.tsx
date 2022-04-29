import React from "react";
import { Translation } from "react-i18next";
import { Modal, Form, Input, Button, Switch } from "antd";

enum Modes {
	collection,
	repertoire
}

interface ImportPGNProps {
	mode: keyof typeof Modes,
	visible: boolean,
	toggleVisible: Function,
	onSubmit: Function
}

class ImportPGN extends React.PureComponent<ImportPGNProps> {
	constructor(props: ImportPGNProps) {
		super(props);

		this.onSubmit = this.onSubmit.bind(this);
	}

	render() {
		return (
			<Translation ns={["common", "database", "chess"]}>
				{
					(t) => (
						<Modal
							title={t("database:import_pgn")}
							visible={this.props.visible}
							onCancel={() => this.props.toggleVisible(false)}
							footer={[
								<Button type="ghost" onClick={() => this.props.toggleVisible(false)}>{t("cancel")}</Button>,
								<Button type="default" form="import-pgn" htmlType="submit">{t("submit")}</Button>
							]}
						>
							<Form
								id="import-pgn"
								onFinish={this.onSubmit}
								autoComplete="off"
							>
								<Form.Item
									label="PGN"
									name="pgn"
									rules={[ { required: true, message: t("database:input_pgn")} ]}
								>
									<Input.TextArea rows={10}/>
								</Form.Item>

								{
									this.props.mode === "repertoire" &&
									<Form.Item
										label={t("repertoires:replace_existing_moves")}
										name="replace"
									>
										<Switch defaultChecked={false}/>
									</Form.Item>
								}
							</Form>
						</Modal>
					)
				}
			</Translation>
		);
	}

	onSubmit(values: any) {
		this.props.onSubmit(values);
	}
}

export default ImportPGN;