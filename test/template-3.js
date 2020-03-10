import Bamboo from '../src';

export default class TestTemplate3 extends Bamboo {
  static get boundProperties() {
    return ['value'];
  }

  get template() {
    return [
      {
        name: 'partial',
        markup: html => html`World`,
        root: this._templater.parseHTML('<div class="container-1"></div>'),
        autoAppend: true
      },
      {
        name: 'sample',
        markup: html => html`Hello`,
        root: this._templater.parseHTML('<div class="container-2"></div>'),
        autoAppend: true,
        prepend: true
      }
    ];
  }
}
