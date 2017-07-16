import {Item} from '../../webStory.model'
export class StorageContainer {
    private currentIndex: number
    private items: any[]

    constructor(itemList: any[],private isFirstCount:boolean) {
        this.items = itemList;
        this.currentIndex = -1;
    }

    public  moveNext(): Item {
        if ((this.currentIndex + 1) >= this.items.length)
            return null;
        //handle case first time then isDone only in case there is less or equal then 1 item in the itemList
        this.currentIndex++;
        let page = {
            isLast: this.currentIndex >= (this.items.length - 1),
            data: this.items[this.currentIndex]
        };

        return page;
    }

    public moveBack(): Item {
        if (this.currentIndex <= 0)
            return null;
        this.currentIndex--;
        let page = {
            isLast: this.isFirstCount ? this.currentIndex === 1 : this.currentIndex === 0,
            data: this.items[this.currentIndex]
        }

        return page;
    }
}