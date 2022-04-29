import React, { useState } from "react";
import { Button, Collapse, notification } from "antd";
import { useTranslation } from "react-i18next";

import { ChessControllerProps } from "../../../lib/types/ChessControllerTypes";
import SelectRepertoire from "../../modals/SelectRepertoire";
import { useMutation } from "@apollo/client";
import { GET_REPERTOIRE, GET_REPERTOIRES, IMPORT_ECO_TO_REPERTOIRE } from "../../../api/queries";
import { RootState } from "../../../redux/store";
import { connect, ConnectedProps } from "react-redux";
import { Link } from "react-router-dom";

interface OpeningProps extends PropsFromRedux {
	opening?: ChessControllerProps["game"]
}

let notification_allowed = false;

function Opening(props: OpeningProps) {
	const [ modal_active, setModalActive ]      = useState(false);
	const { t }                                 = useTranslation(["repertoires"]);
	const [ importEcoToRepertoire, import_res ] = useMutation(IMPORT_ECO_TO_REPERTOIRE,
		{
			refetchQueries : [GET_REPERTOIRES, GET_REPERTOIRE]
		}
	);

	const onSubmit = (values: any) => {
		setModalActive(false);

		if (!values.repertoire || !props.opening) {
			return;
		}

		if (+values.repertoire === -1 && !values.side) {
			return;
		}

		notification_allowed = true;

		importEcoToRepertoire({
			variables : {
				repertoireId : values.repertoire,
				ecoId        : props.opening.id,
				side         : values.side || ""
			}
		});
	}

	if (notification_allowed && import_res.called && !import_res.loading && !import_res.error) {
		notification_allowed = false;

		notification.success({
			message : t("opening_import_success")
		});
	}

	return (
		<Collapse bordered={false} activeKey="opening-panel">
			<Collapse.Panel showArrow={false} id="opening-panel" header={props.opening?.name} key="opening-panel">
				{
					props.authenticated &&
					<Button type="default" onClick={() => setModalActive(true)}>{t("add_to_repertoire")}</Button>
				}
				{
					!props.authenticated &&
					<Link
						to={{
							pathname : "/login/",
							state    : {
								redirect : "eco-database/" + props.opening?.slug
							}
						}}
						component={
							React.forwardRef((props: any, ref: any) => { // eslint-disable-line
								return (
									<Button className="premium" type="default" onClick={props.navigate}>
										{t("sign_up_opening")}
									</Button>
								)
							})
						}
					/>
				}
				<SelectRepertoire
					visible={modal_active}
					toggleVisible={() => setModalActive(!modal_active)}
					onSubmit={onSubmit}
				/>
			</Collapse.Panel>
		</Collapse>
	);
}

const mapStateToProps = (state: RootState) => ({
	authenticated : state.Auth.authenticated
});
const connector      = connect(mapStateToProps);
type PropsFromRedux  = ConnectedProps<typeof connector>;

export default connector(Opening);