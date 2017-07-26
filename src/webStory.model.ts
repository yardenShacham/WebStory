export  interface Page {
	pageContainer?: PageContainer
	template?: string,
	data: any,
	isDefault?: boolean
}
export  interface PageContainer {
	cssSelector: string
	position: string
}
export interface Item {
	isLast: boolean
	data: any
}
export  interface Settings {
	pages: Page[]
	defaultTemplateName?: string
	lifeStyleCallbacks?: LifeStyleCallbacks
	getCurrentPageName: () => string
	configuration?: WebStoryConfiguration
}
export interface WebStoryConfiguration {
	isVisableMode: boolean
	isAutoScrolling: boolean
	renderTimeout: number
}
export interface LifeStyleCallbacks {
	preMoveNext: () => {},
	preMoveBack: () => {},
	preSkip: () => {},
	onMoveNext: () => {},
	onMoveBack: () => {},
	onSkip: () => {},
	afterEnding: () => {}
}
