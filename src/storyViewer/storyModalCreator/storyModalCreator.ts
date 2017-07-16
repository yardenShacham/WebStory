import {getElementByHtmlTemplate, appandToBody} from '../core/domManipulation'
import {Modal} from '../core/constants'

import './storyModal.scss'
export class StoryModalCreator {
    private modelTemplate: string
    private containerMaskClass: string
    private containerContentClass: string
    private currentModelId: string

    constructor(htmlTemplate: string) {
        this.containerMaskClass = "story-modal-container-mask";
        this.containerContentClass = "story-modal-container";
        this.currentModelId = this.generateId();
        this.modelTemplate = this.setTemplate(htmlTemplate);
    }

    public showModal() {
        let modal = getElementByHtmlTemplate(this.modelTemplate);
        appandToBody(modal);
        return new Promise((resolve, reject) => {
            resolve(Modal);
        });
    }

    public removeModal() {
        document.getElementById(this.currentModelId).remove();
    }


    private setTemplate(modalContentTemplate: string) {
        return `<div id="${this.currentModelId}" class="${this.containerMaskClass}">
                    <div class="${this.containerContentClass}">${modalContentTemplate}</div>
                </div>`;
    }

    private generateId() {
        const format = "YYYY-MM-DD-HH:mm";
        const now = moment().format(format);
        return `story-modal-${now}`;
    }
}