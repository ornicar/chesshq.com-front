interface CheckoutSessionModel {
	id: string
	url: string
}

interface LimitModel {
	key: string,
	options?: {
		[key: string]: number | string
	}
}

interface FeatureModel {
	text: LimitModel
	limits?: Array<LimitModel>
}

export interface PlanModel {
	id: string,
	price_monthly: number,
	price_yearly: number,
	tiers: number[],
	available: boolean,
	piece: string,
	features: Array<FeatureModel>
}

export interface CreateCheckoutMutationData {
	createCheckout: {
		session: CheckoutSessionModel
	}
}