import Bamboo from '../src';

export default class TestBoundProperties2 extends Bamboo {
  init() {
    super.init();

    this._state.subscribe('value', () => this.textContent = this._state.get('value'));
    this._state.subscribe('valueWithoutCallback', () => this.textContent = this._state.get('valueWithoutCallback'));
    this._state.subscribe('storeFunction', () => this.textContent = this._state.get('storeFunction')(this._state.get('value')));
  }

  static get boundProperties() {
    return [
      { name: 'dataValue', as: 'value' },
      { name: 'valueWithoutCallback', options: { triggerSubscriptionCallback: false } },
      { name: 'valueWithoutRender', options: { triggerRenderCallback: false } },
      { name: 'storeFunction', options: { storeFunction: true } }
    ];
  }

  static get observedAttributes() {
    return ['data-value'];
  }

  renderCallback() {
    this.textContent = this._state.get('valueWithoutRender');
  }
}
