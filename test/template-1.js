import Bamboo from '../src';

export default class TestTemplate1 extends Bamboo {
  static get initialState() {
    return { value: 0 };
  }

  static get boundProperties() {
    return ['value'];
  }

  static get eventHandlers() {
    return {
      'increase:click': '_onIncreaseClick'
    };
  }

  get template() {
    return html => html`
      <div>Hello World ${this._state.get('value')}!</div>
      <button data-handler="increase" onclick="${this}"></button>
    `;
  }

  _onIncreaseClick() {
    this._state.set('value', value => ++value, { isTransformFunction: true });
  }
}
