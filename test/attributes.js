import Bamboo from '../src';

export default class TestAttributes extends Bamboo {
  static get watchedAttributes() {
    return ['value', 'data-value'];
  }
}
