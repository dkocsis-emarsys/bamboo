class Internals {
  constructor(context, state) {
    this._context = context;
    this._state = state;

    this._state.setOptions('disabled', { type: 'boolean' });
    this._state.setOptions('readonly', { type: 'boolean' });

    this._createInterface();
    this._addTemplate();
  }

  connect() {
    const root = this._context._templater.getRoot('_internals');
    this._state.set('form', root.querySelector('input').form || null);
  }

  _createInterface() {
    const state = this._state;
    Object.defineProperty(this._context, 'name', {
      get() { return state.get('name'); },
      set(value) { state.set('name', value); },
      configurable: true
    });

    Object.defineProperty(this._context, 'value', {
      get() { return state.get('value'); },
      set(value) { state.set('value', value); },
      configurable: true
    });

    Object.defineProperty(this._context, 'form', {
      get() { return state.get('form'); },
      set(value) { console.warn('You can\'t change form property!') },
      configurable: true
    });

    Object.defineProperty(this._context, 'disabled', {
      get() { return state.get('disabled'); },
      set(value) { state.set('disabled', value); },
      configurable: true
    });

    Object.defineProperty(this._context, 'readonly', {
      get() { return state.get('readonly'); },
      set(value) { state.set('readonly', value); },
      configurable: true
    });
  }

  _addTemplate() {
    this._context._templater.add({
      name: '_internals',
      markup: html => html`
        <input
          type="hidden"
          name=${this._state.get('name')}
          value=${this._state.get('value')}
          ?disabled=${this._state.get('disabled')}
          ?readonly=${this._state.get('readonly')}
        >
      `,
      root: document.createElement('div'),
      useShadow: false,
      autoAppend: true,
      prepend: true
    });
  }
}

export default Internals;
