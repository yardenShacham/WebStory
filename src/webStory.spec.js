import chaiAsPromised  from 'chai-as-promised'
import jsdom from 'mocha-jsdom'
import {use, expect} from 'chai'
use(chaiAsPromised);
import 'mocha';

import {WebStory} from './webStory';

describe('Web story test', () => {
  jsdom()

  it('has document', function () {
    var div = document.createElement('div')
    expect(div.nodeName).eql('DIV')
  })
});
