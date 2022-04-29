export interface CommunicationEnrollmentModel {
	name: string
}

export interface UserSettingModel {
	id: number,
	key: string,
	value: string
}

export interface UserModel {
	id: number
	uid: string
	tier: number
}

export interface CommunicationEnrollmentsQueryData {
	communicationEnrollments: Array<CommunicationEnrollmentModel>
}

export interface UserSettingsQueryData {
	userSettings: UserSettingModel[]
}

export interface CreateUserMutationData {
	createUser: {
		user: UserModel,
		errors: string[]
	}
}

export interface EditUserSettingMutationData {
	editSetting: {
		user_setting: UserSettingModel
	}
}

export interface EditUserSettingsMutationData {
	editSettings: {
		user_settings: UserSettingModel[]
	}
}