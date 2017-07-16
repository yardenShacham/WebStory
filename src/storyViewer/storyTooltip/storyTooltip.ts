import  {Bottom, Top, Left, Right} from './storyTooltipPositions'
import  {Location, Size, SizeAndLocation} from './storyTooltip.model'
import {ToolTip} from '../core/constants'
import  {appandToBody, getElementByHtmlTemplate, setStyle, waitForElement} from '../core/domManipulation'
import './storyTooltip.scss'

const MAX_WIDTH: number = 700;

export class StoryTooltip {

    private htmlTemaplte: string
    private currentTooltipId: string
    private defaultSize: Size
    private sizePrefix: string
    private timeout: number
    private marginFromContainer: number
    private containerClass: string

    constructor(template: string, timeout?: number) {
        this.sizePrefix = "px";
        this.defaultSize = {
            width: 100,
            height: 100
        }
        this.marginFromContainer = 25;
        this.containerClass = "story-tool-tip-container ";
        this.timeout = timeout ? timeout : 5000;
        this.htmlTemaplte = this.setTooltipTemplate(template);
    }

    public setTooltip(selector: string, position: string): Promise<boolean> {
        return new Promise((resolve: any, reject: any) => {
            this.calculateElementLocationAndSizes(selector).then((elementData: SizeAndLocation) => {
                let tooltipLocation = this.getTooltipLocaiton(elementData, position);
                if (tooltipLocation !== null) {
                    this.currentTooltipId = this.generateTooltipId(tooltipLocation);
                    this.appandTooltip(tooltipLocation, position);
                    resolve(ToolTip);
                }
            });
        });
    }

    public resetTooltip(idContainer: string, position: string) {
        this.removeTooltip();
        return this.setTooltip(idContainer, position);
    }

    private removeTooltip() {
        let tooltip = document.getElementById(this.currentTooltipId);
        if (tooltip) {
            this.removeFromDom(tooltip);
        }
    }

    public distroy() {
        this.removeTooltip();
    }

    //locations and size(calculation)
    private  calculateElementLocationAndSizes(selector: string): Promise<SizeAndLocation> {
        return new Promise((resolve: any, reject: any) => {
            waitForElement(selector, this.timeout).then((element: any) => {
                resolve({
                    location: this.calculateElementLocation(element),
                    size: this.calculateElementSize(element)
                });
            });
        });
    }

    private  calculateElementLocation(element: any): Location {
        if (element) {
            let rect = element.getBoundingClientRect();
            let elementLeft: any, elementTop: any; //x and y
            let scrollTop = document.documentElement.scrollTop ?
                document.documentElement.scrollTop : document.body.scrollTop;
            let scrollLeft = document.documentElement.scrollLeft ?
                document.documentElement.scrollLeft : document.body.scrollLeft;
            elementTop = rect.top;
            elementLeft = rect.left + scrollLeft;
            return {
                left: elementLeft,
                top: elementTop
            };
        }

        return (null);
    }

    private  calculateElementSize(element: any): Size {
        if (element) {
            let rect = element.getBoundingClientRect();
            return {
                height: rect.height,
                width: rect.width
            };
        }
    }

    private  getTooltipLocaiton(containerData: SizeAndLocation, position: string): Location {
        let tooltipSize = this.measureSize(this.htmlTemaplte);
        if (tooltipSize !== null) {
            switch (position) {
                case Right:
                    return {
                        top: containerData.location.top - ((tooltipSize.height - containerData.size.height ) / 2),
                        left: containerData.location.left + (containerData.size.width + this.marginFromContainer)
                    };
                case Left:
                    return {
                        top: containerData.location.top - ((tooltipSize.height - containerData.size.height ) / 2),
                        left: containerData.location.left - (tooltipSize.width + this.marginFromContainer)
                    };
                case Top:
                    return {
                        top: containerData.location.top - (tooltipSize.height + (this.marginFromContainer) * 2),
                        left: this.getPercentage(containerData.size.width, tooltipSize.width) < 6 ? containerData.location.left - (tooltipSize.width * 0.05) : containerData.location.left
                    };
                case Bottom:
                    return {
                        top: containerData.location.top + (containerData.size.height + this.marginFromContainer),
                        left: this.getPercentage(containerData.size.width, tooltipSize.width) < 6 ? containerData.location.left - (tooltipSize.width * 0.05) : containerData.location.left
                    };
                default:
                    return null;
            }
        }

        return null;
    }

    private getPercentage(small: number, big: number): number {
        return Math.abs(small / big) * 100;
    }

    private measureSize(template: string): Size {
        if (template === null)
            return null;

        let element = getElementByHtmlTemplate(template);
        if (element) {
            appandToBody(element);
            let rectInfo = element.getBoundingClientRect();
            let size = {
                height: rectInfo.height,
                width: rectInfo.width > MAX_WIDTH ? MAX_WIDTH : rectInfo.width
            };

            element.remove();

            return size;
        }
    }

    //others

    private  generateTooltipId(tooltipLocation: Location): string {
        const format = "YYYY-MM-DD-HH:mm";
        const now = moment().format(format);

        return `${now}|${tooltipLocation.top}|${tooltipLocation.left}`;
    }

    private setTooltipTemplate(tooltipContentTemplate: string) {
        return `<div class="${this.containerClass}">${tooltipContentTemplate}</div>`;
    }

    //DOM Manipulation

    private appandTooltip(tooltipLocation: Location, position: string): void {
        let toolTip = getElementByHtmlTemplate(this.htmlTemaplte);
        setStyle(toolTip, {
            position: 'absolute',
            left: `${tooltipLocation.left}${this.sizePrefix}`,
            top: `${tooltipLocation.top}${this.sizePrefix}`,
            zIndex: 9999,
            maxWidth: `${MAX_WIDTH}${this.sizePrefix}`
        });

        toolTip.id = this.currentTooltipId;
        toolTip.classList.add(position);
        appandToBody(toolTip);
    }

    private removeFromDom(element: any): void {
        element.remove();
    }
}