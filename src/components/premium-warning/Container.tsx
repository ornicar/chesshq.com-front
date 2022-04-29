import React, { useState } from "react";
import { Modal } from "antd";

enum ContainerModes {
	embed,
	modal
}

interface ContainerProps {
	mode: keyof typeof ContainerModes
}

function Container(props: React.PropsWithChildren<ContainerProps>) {
	const [ modal_visible, setModalVisible ] = useState(true);

	const closeModal = () => setModalVisible(false);

	switch (props.mode) {
		case "embed":
			return (
				<div className="w-full flex items-center absolute inset-0" style={{ backdropFilter: "blur(6px)" }}>
					<div className="m-auto text-center">
						{props.children}
					</div>
				</div>
			);

		case "modal":
		default:
			return (
				<Modal visible={modal_visible} onCancel={closeModal} footer={""}>
					<div className="w-full flex items-center inset-0" style={{ backdropFilter: "blur(6px)" }}>
						<div className="m-auto text-center">
							{props.children}
						</div>
					</div>
				</Modal>
			);
	}
}

export default Container;