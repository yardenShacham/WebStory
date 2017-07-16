export function appandToBody(element: any) {
    if (document.getElementsByTagName('body') && document.getElementsByTagName('body')[0]) {
        document.getElementsByTagName('body')[0].appendChild(element);
    }
}
export function setStyle(element: any, styleObj: any) {
    let keys = Object.keys(styleObj);
    for (let i = 0; i < keys.length; i++) {
        let styleName = keys[i];
        if (element.style[styleName] !== undefined && element.style[styleName] !== null) {
            element.style[styleName] = styleObj[styleName];
        }
    }
}
export function getElementByHtmlTemplate(htmlTemplate: string) {
    var template = document.createElement('template');
    template.innerHTML = htmlTemplate;
    return (<any>template).content.firstChild;
}
export function waitForElement(selector: string, timeout: number) {
    const timeToTryAgain = 100;
    return new Promise((resolve: any, reject: any) => {
        let executeCount = 0;

        function start() {
            if (executeCount >= (timeout / timeToTryAgain))
                reject("timeout");
            setTimeout(function () {
                let element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                    return;
                }
                else {
                    executeCount++;
                    start();
                }
            }, timeToTryAgain);
        }

        start();
    });
}