import React, { useState } from "react";
import { Progress } from "antd";
import useInterval from "../../../lib/hooks/useInterval";

const MIN_ELO  = 800;
const MAX_ELO  = 2400;
const MAX_DIFF = MAX_ELO - MIN_ELO;

function ProgressBar() {
	const [ elo, setElo ]         = useState(MIN_ELO);
	const [ elapsed, setElapsed ] = useState(0);

	useInterval(() => setElapsed(elapsed + 1), (elapsed <= 4) ? 1000 : null);
	useInterval(
		() => {
			if (elapsed > 4) {
				setElo(elo + 1)
			}
		},
		(elo < MAX_ELO) ? 1 : null
	);

	const diff = elo - MIN_ELO;

	return (
		<Progress
			key="progress-bar"
			percent={(diff / MAX_DIFF) * 100}
			strokeColor={{
				"0%": "#108ee9",
				"100%": "#87d068",
			}}
			format={() => elo + " Elo"}
			strokeWidth={20}
		/>
	);
}

export default ProgressBar;