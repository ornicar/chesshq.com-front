import React, { useState } from "react";
import { Button, notification } from "antd";
import { useTranslation } from "react-i18next";
import { GameModel } from "../../../lib/types/models/Game";
import SelectCollection from "../../modals/SelectCollection";
import { useMutation } from "@apollo/client";
import { SaveMasterGameMutationData } from "../../../lib/types/models/Collection";
import { GET_COLLECTIONS, SAVE_MASTER_GAME } from "../../../api/queries";

interface SaveGameProps {
	id?: GameModel["id"] | number
}

interface FormData {
	collection?: string
}

let notification_allowed = false;

function SaveGame(props: SaveGameProps) {
	const [ modal_active, setModalActive ] = useState(false);
	const { t } = useTranslation("database");
	const [ saveGame, save_res ] = useMutation<SaveMasterGameMutationData>(SAVE_MASTER_GAME, {
		refetchQueries : [GET_COLLECTIONS],
	});

	if (!props.id || window.location.pathname.split("/")[2] !== "master-game") {
		return null;
	}

	const onSubmit = (values: FormData) => {
		setModalActive(false);

		if (!values.collection || values.collection === "") {
			return;
		}

		notification_allowed = true;

		saveGame({
			variables : {
				collectionId: values.collection,
				gameId: props.id
			}
		})
	}

	if (notification_allowed && save_res.called && !save_res.loading && !save_res.error) {
		notification_allowed = false;

		notification.success({
			message : t("game_save_success")
		});
	}

	return (
		<>
			<Button type="default" onClick={() => setModalActive(true)}>{t("save_to_collection")}</Button>
			<SelectCollection
				visible={modal_active}
				toggleVisible={() => setModalActive(!modal_active)}
				onSubmit={onSubmit}
			/>
		</>
	);
}

export default SaveGame;