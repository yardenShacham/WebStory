import chaiAsPromised  from 'chai-as-promised'
import jsdom from 'mocha-jsdom'
import {use, expect, should} from 'chai'
should();
use(chaiAsPromised);
import 'mocha';
import {WebStory} from './webStory';
import {getHtmlAsString} from './utility'

function setElement(elementHtml, onElementId, runOverId) {
	if (runOverId)
		document.getElementById(runOverId) ? document.getElementById(runOverId).parentElement.remove() : null;

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

	describe('start and end story valid test', () => {
		let modalId;
		let webStory;
		beforeEach(function () {
			global.localStorage = setLocalStorageMock();
			let testContainerId = "test-conatiner";
			setElement(`<div id="${testContainerId}"></div>`, null, testContainerId);
		});

		it('first time need to pop up modal', function (done) {
			webStory = new WebStory({
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
					}
				]
			});
			let promise = webStory.startStory();
			let modalShowed = false;
			promise.should.be.fulfilled.then(function () {
				let modal = document.getElementsByTagName("body")[0].children[1];
				if (modal) {
					modalId = modal.id;
					modalShowed = modalId.includes("story-modal");
				}
				else {
					modalShowed = false;
				}
				modalShowed.should.equal(true);
			}).should.notify(done);
		});


		it('end story need to clean the pop up from the DOM', function () {
			webStory.endStory();
			let modal = document.getElementById(modalId);

			expect(modal).to.equal(null);
		});

	});

	describe('start and end story Invalid test', () => {
		let modalId;
		let webStory;
		beforeEach(function () {
			global.localStorage = setLocalStorageMock();
			let testContainerId = "test-conatiner";
			setElement(`<div id="${testContainerId}"></div>`, null, testContainerId);
		});

		it('click on the start btn on the modal need to pop up first tool tip', function (done) {
			let btnSize = 100;
			let btnId = "btn-test"
			let location = {
				top: 500,
				left: 600
			}
			setElement(`<button id="${btnId}" style="width: ${btnSize}px;height: ${btnSize}px;position: absolute;left: ${location.left};top: ${location.top}"></button>`, "test-conatiner");
			webStory = new WebStory({
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
					}, {
						pageContainer: {
							cssSelector: `#${btnId}`,
							position: Bottom
						},
						template: temps.purpleFlowerTemplate,
						data: {
							header: "test-header",
							subHeader: "test-sub"
						}
					}
				]
			});
			let promise = webStory.startStory();
			promise.should.be.fulfilled.then(function () {
				let modal = document.getElementsByTagName("body")[0].children[1];
				if (modal) {
					let startBtn = document.getElementsByClassName("story-start")[0];
					if (startBtn) {
						startBtn.click();
						let wait = 5;
					}
				}
			}).should.notify(done);
		});


	});

});
