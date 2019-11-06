import Bamboo from '../src';

export default class TestTemplate3 extends Bamboo {
  static get boundProperties() {
    return ['value'];
  }

  get template() {
    return [
      {
        name: 'partial',
        markup: html => html`<div>World</div>`,
        container: this._templater.parseHTML('<div class="container-1"></div>'),
        autoAppend: true
      },
      {
        name: 'sample',
        markup: html => html`<div>Hello</div>`,
        container: this._templater.parseHTML('<div class="container-2"></div>'),
        autoAppend: true,
        prepend: true
      }
    ];
  }
}
