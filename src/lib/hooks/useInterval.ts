import { useEffect, useRef } from "react";

function useInterval(callback: Function, delay: number | null) {
	const savedCallback = useRef<Function>();

	// Remember the latest callback.
	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	// Set up the interval.
	useEffect(() => {
		if (delay !== null) {
			const id = setInterval(
				() => {
					savedCallback.current?.();
				},
				delay
			);

			return () => clearInterval(id);
		}
	}, [delay]);
}

export default useInterval;