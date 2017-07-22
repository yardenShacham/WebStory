# Web Story

##### Library for building tours on your front page (Step-by-step guide and feature introduction).
## Dependesies -  None

## Support
WebStory Support UMD(Universal Module Definition), CommonJS, es moudles and regular script tag.
In addtion webStory support all freamworks such as Angular by waiting to the given element to display(There is Configurable timeout).
## Installation
#### Using npm:
```
$ npm install --save webStory
```
## Usage
1. Include the css file (web-story.css) in you app
2. Import the js file (index.js) in your app you can choose the way you want to import the file
```
import { WebStory } from 'webStory' 
var WebStory = require('webStory')
<script src="webStory"></script>
```
3. use the WebStory to create new Story :)
```
webStory = new WebStory({
   getCurrentPageName: function () {
      return "string that represent the current page that you re found";
   },
   pages: [
   {
     pageContainer: undefined - (first page must be witout pageContainer beacasue is dont have one it is popUp)
     template: "<h1>{{test}}</h1> - (in case undefined there is default template)"
     data: {
	   test: "this string will be transfer with {{test}} in the template"
     }
   }, 
   {
     pageContainer: {
	   cssSelector: `css selector for get the element(#elementId)`
	   position: 'left/right/top/botton - from where the tooltip will show'
     },
     template:null or undefined(default template),
     data: {
	   header: "header of the default template",
	   content: "content of the default template"
     }
   }
]});

webStory.startStory(); -- return Promise
```
## API Reference
** [Full Documentation]() **


License
----
###### MIT
