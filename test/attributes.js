import Bamboo from '../src';

export default class TestAttributes extends Bamboo {
  static get observedAttributes() {
    return ['value', 'data-value'];
  }
}
