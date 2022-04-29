import React from "react";
import { Menu } from "antd";
import { useTranslation } from "react-i18next";
import { RepertoireMoveDeletionMutationData, RepertoireMoveModel } from "../../../lib/types/models/Repertoire";
import { useMutation } from "@apollo/client";
import { DELETE_REPERTOIRE_MOVE, REORDER_REPERTOIRE_MOVE } from "../../../api/queries";

interface ContextMenuProps {
	move_id: RepertoireMoveModel["id"],
	first_child?: boolean,
	last_child?: boolean
}

function ContextMenu(props: ContextMenuProps) {
	const { t } = useTranslation("common");
	const [ deleteMove ] = useMutation<RepertoireMoveDeletionMutationData>(DELETE_REPERTOIRE_MOVE,
		{
			update(cache, data) {
				const network_repertoire = data.data?.deleteRepertoireMove?.repertoire;

				const network_moves: {[id: RepertoireMoveModel["id"]] : RepertoireMoveModel} = {};

				for (const move of network_repertoire?.moves ?? []) {
					network_moves[move.id] = move;
				}

				const cache_moves = data.data?.deleteRepertoireMove?.previousMoves;

				for (const move of cache_moves ?? []) {
					const network_move = network_moves[move.id];

					if (!network_move) {
						cache.evict({ id: "RepertoireMove:" + move.id });
					}
				}
			}
		}
	);
	const [ reorderMove ] = useMutation(REORDER_REPERTOIRE_MOVE);

	const onDelete = () => {
		deleteMove({
			variables : {
				id : props.move_id
			}
		});
	}

	const onReorder = (direction: string) => {
		reorderMove({
			variables : {
				id        : props.move_id,
				direction : direction
			}
		});
	}

	return (
		<>
			<Menu.Item key="delete-move" onClick={onDelete}>{t("delete")}</Menu.Item>
			{props.first_child === false && <Menu.Item key="move-up" onClick={() => onReorder("up")}>{t("move_up")}</Menu.Item>}
			{props.last_child === false && <Menu.Item key="move-down" onClick={() => onReorder("down")}>{t("move_down")}</Menu.Item>}
		</>
	);
}

export default ContextMenu;