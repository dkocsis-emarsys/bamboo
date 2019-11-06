import Bamboo from '../src';

export default class TestTemplate2 extends Bamboo {
  static get boundProperties() {
    return ['value'];
  }

  get template() {
    return [{
      name: 'sample',
      markup: html => html`<div>Hello World ${this._state.get('value')}!</div>`,
      container: this._templater.parseHTML('<div class="container"></div>'),
      autoAppend: true,
      prepend: true
    }];
  }
}
