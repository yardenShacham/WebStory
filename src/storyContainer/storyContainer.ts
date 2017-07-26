import {StorageContainer} from './storageContainer/storageContainer'
import {StoryViewer}from '../storyViewer/storyViewer'
import {Page} from '../webStory.model'


export class StoryContainer {
	private storage: StorageContainer
	private viewer: StoryViewer
	private isHasModal: boolean

	constructor(pages: Page[], renderTimeout: number, isAutoScrolling: boolean) {
		this.isHasModal = this.setPageDataWithCurrentPageNumber(pages);
		this.storage = new StorageContainer(pages, this.isHasModal);
		this.viewer = new StoryViewer(renderTimeout, isAutoScrolling);
	}


	public moveNext(): Promise<any> {
		let currentPage = this.storage.moveNext();
		return this.viewer.setPage(currentPage.data).then((viewType: any) => {
			return {
				viewType: viewType,
				isLast: currentPage.isLast,
				isDefault: currentPage.data.isDefault
			};
		});

	}

	public resetPage() {
		return this.viewer.resetPage();
	}

	public moveBack(): Promise<any> {
		let currentPage = this.storage.moveBack();
		return this.viewer.setPage(currentPage.data).then((viewType: any) => {
			return {
				viewType: viewType,
				isLast: currentPage.isLast,
				isDefault: currentPage.data.isDefault
			};
		});
	}

	public skipStory() {
		this.endStory();
	}

	public endStory() {
		this.storage = undefined;
		this.viewer.setPage(null);
		this.viewer = undefined;
	}


	private  setPageDataWithCurrentPageNumber(pages: Page[]) {
		let isHasModal = false;
		for (let i = 0; i < pages.length; i++) {
			if (!pages[i].pageContainer) {
				isHasModal = true;
				break;
			}
			pages[i].data.currentPageNumber = i + 1;
			pages[i].data.totalPages = pages.length;
		}
		if (isHasModal) {
			for (let i = 1; i < pages.length; i++) {
				pages[i].data.currentPageNumber = i;
				pages[i].data.totalPages = pages.length - 1;
			}
		}
		return isHasModal;
	}
}
