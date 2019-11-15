import Bamboo from '../src';

export default class TestBoundProperties1 extends Bamboo {
  init() {
    super.init();

    this._state.subscribe('value', () => this.textContent = this._state.get('value'));
  }

  static get boundProperties() {
    return ['value'];
  }

  static get watchedAttributes() {
    return ['value'];
  }
}
