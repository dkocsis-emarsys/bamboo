import State from '@dkocsis-emarsys/bamboo-state';
import debounce from './libs/debounce';
import globalState from './libs/global-state';
import NodeCollection from './libs/node-collection';
import Templater from './libs/templater';

export default class Bamboo extends HTMLElement {
  constructor(...$) { const _ = super(...$); _.init(); return _; }
  init(options = {}) {
    this.__connected = false;

    this.__childConnectedCallback = this.__childConnectedCallback.bind(this);
    this.__childDisconnectedCallback = this.__childDisconnectedCallback.bind(this);
    this.__notifyParentEvent = this.__notifyParentEvent.bind(this);

    this.contentChangedCallback = this.contentChangedCallback.bind(this);
    this.childrenChangedCallback = debounce(this.childrenChangedCallback.bind(this));
    this.renderCallback = this.renderCallback.bind(this);

    this._templater = new Templater(this);
    this._templater.init(this.template);

    this._options = new State({
      id: Symbol(),
      className: false,
      listenChildren: false,
      connectedChildren: new NodeCollection(),
      notifyParent: false,
      watchContent: false,
      watchGlobalState: false
    }, this.renderCallback);

    this._state = new State(this.constructor.defaultState || {}, this.renderCallback);
    this._globalState = globalState;

    this._options.subscribe('notifyParent', this.__notifyParent.bind(this));
    this._options.subscribe('listenChildren', this.__listenChildren.bind(this));
    this._options.subscribe('watchContent', this.__watchContent.bind(this));
    this._options.subscribe('watchGlobalState', this.__watchGlobalState.bind(this));

    this.__mutationObserver = new MutationObserver(this.contentChangedCallback);
    this.__notifyParentSubscription = null;
    this.__listenChildrenSubscription = null;
    this.__watchGlobalStateSubscription = null;

    Object.keys(options).forEach(option => {
      this._options.set(option, options[option]);
    });

    if (this.constructor.stateOptions) {
      Object.keys(this.constructor.stateOptions).forEach(option => {
        this._state.setOptions(option, this.constructor.stateOptions[option]);
      });
    }

    this.__boundProperties();
    this.__eventHandlers();
  }

  connectedCallback() {
    this.__connected = true;

    const className = this._options.get('className');

    if (className) {
      className.split(' ').forEach(name => this.classList.add(name));
    }

    this._templater.connect();

    this.renderCallback();

    this.__notifyParentEvent('_child.connected');
  }

  disconnectedCallback() {
    this.__connected = false;

    this._templater.disconnect();

    this.__notifyParentEvent('_child.disconnected');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const transformedName = name.replace(/-([a-z])/g, g => g[1].toUpperCase());
    this[transformedName] = newValue;
  }

  renderCallback() {
    if (this.__connected) { this._templater.renderAll(); }
  }

  contentChangedCallback() {}
  childrenChangedCallback() {}

  handleEvent(event) {
    if (!this.constructor.eventHandlers || !this.__connected) { return; }

    Object.keys(this.constructor.eventHandlers).forEach(handlerKey => {
      const [handlerName, handlerEventType] = handlerKey.split(':');

      if (event.type === handlerEventType && (handlerName === '' || event.currentTarget.getAttribute('data-handler') === handlerName)) {
        const handlerFunction = this[this.constructor.eventHandlers[handlerKey]].bind(this);

        if (!handlerFunction) { return; }

        handlerFunction(event);
      }
    });
  }

  _dispatchEvent(eventName, detail = {}, bubbles = true) {
    this.dispatchEvent(new CustomEvent(eventName, { detail, bubbles }));
  }

  __boundProperties() {
    if (!this.constructor.boundProperties) { return; }

    this.constructor.boundProperties.forEach(property => {
      const propertyName = property.name || property;
      const propertyOptions = property.options || {};
      const stateName = property.as || propertyName;

      Object.defineProperty(this, propertyName, {
        get() { return this._state.get(stateName); },
        set(value) { this._state.set(stateName, value, propertyOptions); },
        configurable: true
      });

      const defaultValue = this._state.getDefaultValue(stateName);

      if (defaultValue !== undefined) {
        this._state.set(stateName, defaultValue);
      }
    });
  }

  __eventHandlers() {
    if (!this.constructor.eventHandlers) { return; }

    Object.keys(this.constructor.eventHandlers).forEach(handlerKey => {
      const [handlerName, handlerEventType] = handlerKey.split(':');

      if (handlerName !== '') { return; }

      this.addEventListener(handlerEventType, this);
    });
  }

  __notifyParent(value) {
    if (value) {
      this.__notifyParentSubscription = this._state.subscribe('', () => {
        this.__notifyParentEvent('_child.changed');
      });
    } else if (this.__notifyParentSubscription) {
      this.__notifyParentSubscription.unsubscribe();
    }
  }

  __notifyParentEvent(eventName) {
    if (!this._options.get('notifyParent')) { return; }

    this.dispatchEvent(new CustomEvent(eventName, {
      detail: {
        id: this._options.get('id'),
        state: this._state.get()
      },
      bubbles: true
    }));
  }

  __listenChildren() {
    if (this._options.get('listenChildren')) {
      this.addEventListener('_child.connected', this.__childConnectedCallback, true);
      this.addEventListener('_child.changed', this.__childChangedCallback, true);
      this.__listenChildrenSubscription = this._options.subscribe('connectedChildren', this.childrenChangedCallback);
    } else if (this.__listenChildrenSubscription) {
      this.removeEventListener('_child.connected', this.__childConnectedCallback);
      this.removeEventListener('_child.changed', this.__childChangedCallback);
      this.__listenChildrenSubscription.unsubscribe();
    }
  }

  __childConnectedCallback(event) {
    event.stopPropagation();
    event.currentTarget.addEventListener('_child.disconnected', this.__childDisconnectedCallback, true);

    const childrenCollection = this._options.get('connectedChildren');
    childrenCollection.upsert(event.detail.id, event.target, event.detail.state);
    this._options.triggerChange('connectedChildren');
  }

  __childChangedCallback(event) {
    event.stopPropagation();
    const childrenCollection = this._options.get('connectedChildren');
    childrenCollection.upsert(event.detail.id, event.target, event.detail.state);
    this._options.triggerChange('connectedChildren');
  }

  __childDisconnectedCallback(event) {
    event.stopPropagation();
    const childrenCollection = this._options.get('connectedChildren');
    childrenCollection.remove(event.detail.id);
    this._options.triggerChange('connectedChildren');
  }

  __watchContent() {
    if (this._options.get('watchContent')) {
      this.__mutationObserver.observe(this, {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true
      });
    } else {
      this.__mutationObserver.disconnect();
    }
  }

  __watchGlobalState() {
    const globalState = this._options.get('watchGlobalState');

    if (globalState) {
      const globalStateKey = globalState === true ? '' : globalState;
      this.__watchGlobalStateSubscription = this._globalState.subscribe(globalStateKey, this.renderCallback);
    } else if (this.__watchGlobalStateSubscription) {
      this.__watchGlobalStateSubscription.unsubscribe();
    }
  }
}
