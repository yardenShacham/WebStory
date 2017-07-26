import  {StoryContainer} from './storyContainer/storyContainer'
import {isFunction, isNull, isString, isBoolean} from './utility'
import  {Page, Settings, LifeStyleCallbacks, WebStoryConfiguration} from './webStory.model'
import  {Modal} from './storyViewer/core/constants'
import purpleFlowerTemplate from './webStoryDefaultTemplates/purpleFlower.html';
import purpleFlowerLastPageTemplate from './webStoryDefaultTemplates/purpleFlower-lastPage.html';
import welcomePageTemplate from './webStoryDefaultTemplates/welcomePage.html';
import './webStoryDefaultTemplates/templates-style.scss'

export class WebStory {
	private storyContainer: StoryContainer
	private lifeStyleCallbacks: LifeStyleCallbacks
	private isLastPage: boolean
	private isFirstPage: boolean
	private startStoryCallCount: number = 0
	private configuration: WebStoryConfiguration
	private moveNextStoryCallCount: number = 0
	private getCurrentPageName: () => string

	constructor(settings: Settings) {
		this.getCurrentPageName = settings.getCurrentPageName;
		if (!isFunction(this.getCurrentPageName)) {
			const message = 'please insert page name by setting the getCurrentPageName function in the settings';
			console.error(message);
			throw new Error(message);
		}
		this.lifeStyleCallbacks = settings.lifeStyleCallbacks;
		this.configuration = settings.configuration ? settings.configuration : {
			isVisableMode: true,
			isAutoScrolling: null,
			renderTimeout: null
		}
		window.addEventListener('resize', this.onResize, null);
		this.storyContainer = new StoryContainer(this.setPagesWithDefaultTemplate(settings.pages),
			this.configuration.renderTimeout, this.configuration.isAutoScrolling);
	}


	public startStory = () => {
		if (!this.isNeverTell()) {
			this.startStoryCallCount++;
			if (this.moveNextStoryCallCount === 0 && this.startStoryCallCount <= 1) {
				return this.storyContainer.moveNext().then((pageInfo: any) => {
					if (pageInfo.viewType === Modal) {
						this.setClickLisenerByClassName('start-story', this.startFirstPage);
						this.setClickLisenerByClassName("story-skip", this.skip);
						this.setClickLisenerByClassName("story-neverTell", this.setNeverTell);
					}
				});
			}
			else
				console.error('you calling moveNext before start or you called startStory already');
		}
	}

	public endStory = (event: any) => {
		if (event)
			event.preventDefault();
		if (this.lifeStyleCallbacks && isFunction(this.lifeStyleCallbacks.afterEnding))
			this.lifeStyleCallbacks.afterEnding();

		this.storyContainer.endStory();
		window.removeEventListener('resize', this.onResize);
		this.removeAllStoryAction();
	}

	public neverTell() {
		localStorage.setItem(this.getNeverTellId(), "never");
	}

	public removeNeverTell() {
		localStorage.removeItem(this.getNeverTellId());
	}

	private startFirstPage = () => {
		return this.storyContainer.moveNext().then((pageInfo: any) => {
			this.isLastPage = pageInfo.isLast;
			this.setStoryActions(this.isLastPage);
			if (this.configuration.isVisableMode && !pageInfo.isDefault)
				this.hideBackStoryBtn();
			else
				this.disableByClassName("story-back");
		});
	}

	private isNeverTell(): any {
		let neverTellId = this.getNeverTellId();
		if (neverTellId) {
			return localStorage.getItem(neverTellId);
		} else
			console.error("cant start get page name please fill getCurrentPageName function");

		return null;
	}

	private moveNext = (event: any) => {
		event.preventDefault();
		if (this.lifeStyleCallbacks && isFunction(this.lifeStyleCallbacks.preMoveNext))
			this.lifeStyleCallbacks.preMoveNext();

		if (!this.isLastPage) {
			this.moveNextStoryCallCount++;
			this.removeOldStoryAction();
			this.storyContainer.moveNext().then((pageInfo: any) => {
				this.isLastPage = pageInfo.isLast;
				this.isFirstPage = false;
				this.setStoryActions(this.isLastPage);
			});
		}
	}

	private moveBack = (event: any) => {
		event.preventDefault();

		if (this.lifeStyleCallbacks && isFunction(this.lifeStyleCallbacks.preMoveBack))
			this.lifeStyleCallbacks.preMoveBack();
		if (!this.isFirstPage) {
			this.storyContainer.moveBack().then((pageInfo: any) => {
				this.isFirstPage = pageInfo.isLast;
				this.isLastPage = false;
				this.setStoryActions();

				if (this.isFirstPage) {
					if (this.configuration.isVisableMode && !pageInfo.isDefault) {
						this.hideBackStoryBtn();
					}
					else {
						this.disableByClassName("story-back");
					}
				}
			});
		}
	}

	private skip = (event: any) => {
		event.preventDefault();
		if (this.lifeStyleCallbacks && isFunction(this.lifeStyleCallbacks.preSkip))
			this.lifeStyleCallbacks.preSkip();
		this.storyContainer.skipStory();
	}

	private  disableByClassName(className: string) {
		let elements = document.getElementsByClassName(className);
		if (elements[0]) {
			elements[0].attributes.setNamedItem(document.createAttribute("disabled"))
		}
	}

	private hideBackStoryBtn() {
		this.hideByClassName("story-back");
		let nextBtn = document.getElementsByClassName("story-next");
		let pageCounter: any = document.getElementsByClassName("page-counter");
		if (nextBtn && nextBtn.length && nextBtn[0] && pageCounter && pageCounter.length && pageCounter[0]) {
			nextBtn[0].classList.add("hide-back")
			pageCounter[0].classList.add("no-back");
		}
	}

	private  hideByClassName(className: string) {
		let elements: any = document.getElementsByClassName(className);
		if (elements[0]) {
			elements[0].style.display = "none";
		}
	}

	private setNeverTell = (event: any) => {
		let isNever = isString(event.target.attributes.isChecked) ? event.target.attributes.isChecked === "true" : isBoolean(event.target.checked) ? event.target.checked : null;
		if (!isNull(isNever)) {
			if (isNever) {
				localStorage.setItem(this.getNeverTellId(), "never");
			}
			else {
				localStorage.removeItem(this.getNeverTellId());
			}
		}
	}

	private getNeverTellId = () => {
		let pageName = this.getCurrentPageName();
		if (pageName)
			return `story-never-tell-${pageName}`

		return null;
	}

	private onResize = () => {
		if (!this.isNeverTell()) {
			if (this.storyContainer && isFunction(this.storyContainer.resetPage)) {
				this.storyContainer.resetPage().then(() => {
					if (this.isLastPage) {
						this.setClickLisenerByClassName("story-end", this.endStory);
						this.setStoryActions(true);
					}
					else if (this.isFirstPage) {
						this.setStoryActions();
						this.disableByClassName("story-back");
					}
					else {
						this.setStoryActions();
					}
				});
			}
		}
	}

	private  setStoryActions(isEnd: boolean = false) {
		if (!isEnd)
			this.setClickLisenerByClassName("story-next", this.moveNext);
		else
			this.setClickLisenerByClassName("story-end", this.endStory);

		this.setClickLisenerByClassName("story-back", this.moveBack);
		this.setClickLisenerByClassName("story-skip", this.skip);
		this.setClickLisenerByClassName("story-neverTell", this.setNeverTell);
	}

	private  removeOldStoryAction() {
		this.removeClickLisenerByClassName("story-next", this.moveNext);
		this.removeClickLisenerByClassName("story-back", this.moveBack);
		this.removeClickLisenerByClassName("story-skip", this.skip);
		this.removeClickLisenerByClassName("story-neverTell", this.setNeverTell);
	}

	private removeAllStoryAction() {
		this.removeClickLisenerByClassName("story-next", this.moveNext);
		this.removeClickLisenerByClassName("story-back", this.moveBack);
		this.removeClickLisenerByClassName("story-skip", this.skip);
		this.removeClickLisenerByClassName("story-neverTell", this.setNeverTell);
		this.removeClickLisenerByClassName("story-end", this.endStory);
	}

	private  removeClickLisenerByClassName(className: string, callback: any) {
		let element: any = document.getElementsByClassName(className);
		if (element[0]) {
			element[0].removeEventListener('click', callback);
		}
	}

	private  setClickLisenerByClassName(className: string, callback: any) {
		let element: any = document.getElementsByClassName(className);
		if (element[0]) {
			element[0].addEventListener('click', callback, null);
		}
	}

	private  setPagesWithDefaultTemplate(pages: Page[]): Page[] {
		let newPages: Page[] = [];
		let isModalDefiend = false;
		for (let i = 0; i < pages.length; i++) {
			if (!pages[i].pageContainer) {
				isModalDefiend = true;
				if (!pages[i].data.header)
					pages[i].data.header = `Welcome to ${this.getCurrentPageName()} Tour!`;
				if (!pages[i].data.subHeader)
					pages[i].data.subHeader = "";
				if (!pages[i].template) {
					pages[i].template = welcomePageTemplate;
					pages[i].isDefault = true;
				}
				else
					pages[i].isDefault = false;
			}

			newPages.push({
				data: pages[i].data,
				pageContainer: pages[i].pageContainer,
				template: pages[i].template ? pages[i].template : this.getDefaultTemplate(i == (pages.length - 1)),
				isDefault: pages[i].template ? false : true
			});
		}
		if (!isModalDefiend) {
			newPages.unshift({
				data: {
					header: `Welcome to ${this.getCurrentPageName()} Tour!`,
					subHeader: ""
				},
				pageContainer: null,
				template: welcomePageTemplate
			});
		}

		return newPages;
	}

	private getDefaultTemplate(isLastPage: boolean): string {
		if (isLastPage)
			return purpleFlowerLastPageTemplate;

		return purpleFlowerTemplate;
	}
}
