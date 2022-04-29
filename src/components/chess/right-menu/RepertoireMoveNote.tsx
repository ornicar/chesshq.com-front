import React from "react";
import { Input, Spin } from "antd";
import { ChessControllerState } from "../../../lib/types/ChessControllerTypes";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_REPERTOIRE_MOVE_NOTE, GET_REPERTOIRE_MOVE_NOTE } from "../../../api/queries";
import { useTranslation } from "react-i18next";
import { RepertoireMoveNoteMutationData, RepertoireMoveNoteQueryData } from "../../../lib/types/models/Repertoire";

interface RepertoireMoveNoteProps {
	active_uuid?: ChessControllerState["last_uuid"]
}

function RepertoireMoveNote(props: RepertoireMoveNoteProps) {
	const { t } = useTranslation("chess");
	const { loading, data } = useQuery<RepertoireMoveNoteQueryData>(GET_REPERTOIRE_MOVE_NOTE, {
		variables : {
			moveId : props.active_uuid
		},
		skip : (!props.active_uuid)
	});
	const [ createNote ] = useMutation<RepertoireMoveNoteMutationData>(CREATE_REPERTOIRE_MOVE_NOTE,
		{
			update(cache, data) {
				if (!data.data?.createRepertoireMoveNote?.note) {
					return;
				}

				cache.writeQuery({
					query     : GET_REPERTOIRE_MOVE_NOTE,
					data      : {
						repertoireMoveNote : data.data?.createRepertoireMoveNote?.note
					},
					variables : {
						moveId : data.data?.createRepertoireMoveNote?.note?.repertoireMoveId
					}
				})
			}
		}
	);

	if (!props.active_uuid) {
		return <></>;
	}

	return (
		<Spin spinning={loading}>
			<Input.TextArea
				placeholder={t("move_note")}
				style={{ marginTop: "0.5rem" }}
				key={"note-" + props.active_uuid + "-" + (data?.repertoireMoveNote?.id || "none")}
				defaultValue={data?.repertoireMoveNote?.value || ""}
				onChange={(e) => {
					if (!props.active_uuid) {
						return;
					}

					createNote({
						variables : {
							moveId : props.active_uuid,
							value  : e.target.value
						}
					})
				}}
			/>
		</Spin>
	);
}

export default RepertoireMoveNote;