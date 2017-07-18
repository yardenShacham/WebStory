import chaiAsPromised  from 'chai-as-promised'
import jsdom from 'mocha-jsdom'
import {use, expect} from 'chai'
use(chaiAsPromised);
import 'mocha';
import {WebStory} from './webStory';
import {getHtmlAsString} from './utility'

function setElement(elementHtml, onElementId) {
	let div = document.createElement('div')
	div.innerHTML = elementHtml;
	if (!onElementId)
		document.getElementsByTagName('body')[0].appendChild(div);
	else
		document.getElementById(onElementId).appendChild(div);
}

function setLocalStorageMock() {
	var storage = {};

	return {
		setItem: function (key, value) {
			storage[key] = value || '';
		},
		getItem: function (key) {
			return key in storage ? storage[key] : null;
		},
		removeItem: function (key) {
			delete storage[key];
		},
		get length() {
			return Object.keys(storage).length;
		},
		key: function (i) {
			var keys = Object.keys(storage);
			return keys[i] || null;
		}
	};
}

const Left = "left"
const Right = "right"
const Top = "top"
const Bottom = "bottom"


describe('Web story test', () => {
	jsdom();
	const temps = {
		purpleFlowerTemplate: getHtmlAsString("./webStoryDefaultTemplates/purpleFlower.html"),
		purpleFlowerLastPageTemplate: getHtmlAsString("./webStoryDefaultTemplates/purpleFlower-lastPage.html"),
		welcomePageTemplate: getHtmlAsString("./webStoryDefaultTemplates/welcomePage.html")
	}

	beforeEach(function () {
		global.localStorage = setLocalStorageMock();
		setElement(`<div id="test-conatiner"></div>`);
	});

	it('has conatiner', function () {
		var div = document.getElementById("test-conatiner");
		expect(div.nodeName).eql('DIV');
	});

	it('default template is seted', function () {
		let btnSize = 100;
		let btnId = ""
		let location = {
			top: 500,
			left: 600
		}
		setElement(`<button id="${btnId}" style="width: ${btnSize}px;height: ${btnSize}px;position: absolute;left: ${location.left};top: ${location.top}"></button>`, "test-conatiner");
		let foundBtn = document.getElementById("btn-test");
		let webStory = new WebStory({
			getCurrentPageName: function () {
				return "test-page";
			},
			pages: [
				{
					template: temps.welcomePageTemplate,
					data: {
						header: "test-header",
						subHeader: "test-sub"
					}
				},
				{
					pageContainer: {
						cssSelector: `#${btnId}`,
						position: Bottom
					},
					template: temps.purpleFlowerTemplate,
					data: {
						header: "test-header",
						content: "test-content"
					}
				}
			]
		});
		webStory.startStory();
		expect(foundBtn.nodeName).eql('BUTTON');
	});
});
