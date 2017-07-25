import  {Page} from '../webStory.model'
import  {StoryTooltip} from './storyTooltip/storyTooltip'
import {StoryModalCreator} from './storyModalCreator/storyModalCreator'
import {getTemplate} from '../utility'
export class StoryViewer {
	private tooltip: StoryTooltip
	private currentPage: Page
	private modalCreator: StoryModalCreator

	constructor(private renderTimeout: number) {
		this.renderTimeout = renderTimeout;
	}

	public setPage(page: Page) {
		//remove old tool tip is has any
		if (this.tooltip)
			this.distroyTooltipInstance();
		if (this.modalCreator)
			this.distroyModal();

		if (page) {
			if (page.pageContainer) {
				//tooltip
				let fullHtmlTemplate = this.createTemplate(page.data, page.template);
				if (fullHtmlTemplate) {
					this.tooltip = new StoryTooltip(fullHtmlTemplate, this.renderTimeout);
					this.currentPage = page;
					return this.tooltip.setTooltip(page.pageContainer.cssSelector, page.pageContainer.position);
				}
			}
			else {
				//modal
				let fullHtmlTemplate = this.createTemplate(page.data, page.template);
				if (fullHtmlTemplate) {
					this.modalCreator = new StoryModalCreator(fullHtmlTemplate);
					return this.modalCreator.showModal();
				}
			}
		}
	}

	public resetPage() {
		try {
			return this.tooltip.resetTooltip(this.currentPage.pageContainer.cssSelector, this.currentPage.pageContainer.position);
		}
		catch (e) {
			return null;
		}
	}

	private  distroyTooltipInstance() {
		this.tooltip.distroy();
		this.tooltip = undefined;
	}

	private  distroyModal() {
		this.modalCreator.removeModal();
		this.modalCreator = undefined;
	}

	private  createTemplate(data: any, htmlTemplate: string) {
		try {
			return getTemplate(htmlTemplate)(data);
		}
		catch (error) {
			console.error("cant create template the data and the template is not suitable");
			return null;
		}

	}
}
