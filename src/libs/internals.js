import { html, svg, render } from 'lighterhtml';

class Internals {
  constructor(context, state) {
    this._context = context;
    this._state = state;

    this._createInterface();
    this._addTemplate();
  }

  connect() {
    const container = this._context._templater.getContainer('_internals');
    this._state.set('form', container.querySelector('input').form || null);
  }

  _createInterface() {
    Object.defineProperty(this._context, 'name', {
      get() { return this._state.get('name'); },
      set(value) { this._state.set('name', value); },
      configurable: true
    });

    Object.defineProperty(this._context, 'value', {
      get() { return this._state.get('value'); },
      set(value) { this._state.set('value', value); },
      configurable: true
    });
  }

  _addTemplate() {
    this._context._templater.add({
      name: '_internals',
      markup: html => html`
        <input type="hidden" name="${this._state.get('name')}" value="${this._state.get('value')}">
      `,
      container: document.createElement('div'),
      autoAppend: true,
      prepend: true
    });
  }
}

export default Internals;
