export interface Destinations {
	free: boolean,
	dests: Map<string, string[]>
}

export interface ForcedArrows {
	[key: string]: string[]
}

export interface DrawShape {
	brush: string,
	orig: string,
	mouseSq: string,
	dest: string,
	snapToValidMove?: boolean
	pos?: number[]
}

interface DrawBrush {
	key: string,
	color: string,
	opacity: number,
	lineWidth: number
}

export interface Drawable {
	enabled?: boolean,
	display?: boolean,
	eraseOnClick?: boolean,
	shapes: Array<DrawShape>,
	autoShapes: DrawShape[],
	onChange?: (shapes: DrawShape[]) => void,
	brushes: {
		[key: string]: DrawBrush
	}
}