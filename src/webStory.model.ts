export  interface Page {
    pageContainer?: PageContainer
    template?: string,
    data: any
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
