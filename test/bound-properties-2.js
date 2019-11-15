import Bamboo from '../src';

export default class TestBoundProperties2 extends Bamboo {
  init() {
    super.init();

    this._state.subscribe('value', () => this.textContent = this._state.get('value'));
    this._state.subscribe('triggerCallback', () => this.textContent = this._state.get('triggerCallback'));
    this._state.subscribe('storeFunction', () => this.textContent = this._state.get('storeFunction')(this._state.get('value')));
  }

  static get boundProperties() {
    return [
      { name: 'dataValue', as: 'value' },
      { name: 'triggerCallback', options: { triggerCallback: false } },
      { name: 'triggerRender', options: { triggerRender: false } },
      { name: 'storeFunction', options: { storeFunction: true } }
    ];
  }

  static get watchedAttributes() {
    return ['data-value'];
  }

  renderCallback() {
    super.renderCallback();

    if (!this._state.get('triggerRender')) { return; }

    this.textContent = this._state.get('triggerRender');
  }
}
