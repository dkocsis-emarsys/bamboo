import { html, svg, render } from 'uhtml';

class Templater {
  constructor(context) {
    this._context = context;
    this._templates = [];
    this._mutationObserver = new MutationObserver(this._context.contentChangedCallback.bind(this));
  }

  init() {
    if (typeof this._context.template === 'object') {
      this._context.template.forEach(template => this.add(template));
    } else if (this._context.template) {
      const template = {
        name: '_default',
        markup: this._context.template,
        root: this._context,
        autoAppend: true
      };

      this.add(template);
    }
  }

  add(template) {
    const options = {
      name: template.name,
      markup: template.markup,
      root: template.root || null,
      useShadow: template.useShadow === false ? false : true,
      openShadow: template.openShadow === false ? false : true,
      autoAppend: template.autoAppend || false,
      prepend: template.prepend || false
    };

    if (options.useShadow && options.autoAppend) {
      options.root.attachShadow({ mode: options.openShadow ? 'open' : 'closed' });
      const renderRoot = document.createElement('div');
      renderRoot.setAttribute('data-render-root', '');
      options.root.shadowRoot.appendChild(renderRoot);
    }

    this._templates.push(options);
  }

  parseHTML(content) {
    return new DOMParser().parseFromString(content, 'text/html').body.childNodes[0];
  }

  connect() {
    this._cleanUpRoot();

    this._templates.forEach(template => {
      if (template.root && template.root !== this._context) {
        if (!template.useShadow) {
          template.root.setAttribute('data-render-root', '');
        }

        if (!template.autoAppend) { return; }

        if (template.prepend) {
          this._context.insertAdjacentElement('afterbegin', template.root);
        } else {
          this._context.appendChild(template.root);
        }
      }
    });
  }

  disconnect() {
    this._templates.forEach(template => {
      if (template.root && template.root !== this._context) {
        template.root.parentNode.removeChild(template.root);
      }
    });
  }

  render(templateName = '_default') {
    return this._render(templateName);
  }

  renderAll() {
    this._templates.forEach(template => {
      if (template.markup && template.root) {
        render((template.root.shadowRoot && template.root.shadowRoot.querySelector('[data-render-root]')) || template.root, this._render(template.name));
      }
    });
  }

  getRoot(templateName = '_default') {
    return this._templates.find(template => template.name === templateName).root;
  }

  buildFromTemplate(template) {
    this._observeTemplate(template);

    return () => {
      const innerHTML = Array.from(template.childNodes)
        .map(child => child.nodeType === 3 ? child.textContent : child.outerHTML)
        .join('')
        .replace(/\${([^}]*)}/g, (match, variable) => this._context._state.get(variable));

      const output = [[innerHTML]];
      output.raw = { value: [innerHTML] };

      return html(...output);
    };
  }

  hasMarkup(templateName = '_default') {
    return !!this._templates.find(template => template.name === templateName).markup;
  }

  setMarkup(templateName = '_default', value) {
    this._templates.find(template => template.name === templateName).markup = value;
    this._context.contentChangedCallback();
  }

  _render(templateName = '_default') {
    const markup = this._templates.find(template => template.name === templateName).markup;

    if (typeof markup === 'function') {
      return markup.bind(this._context, html, svg);
    } else if (typeof markup === 'object' && markup) {
      const markupElement = markup.nodeName === 'TEMPLATE' ? markup.content : markup;

      return this.buildFromTemplate(markupElement);
    } else if (typeof markup === 'string') {
      const markupSelector = document.querySelector(markup);
      const markupElement = markupSelector.nodeName === 'TEMPLATE' ? markupSelector.content : markupSelector;

      return this.buildFromTemplate(markupElement);
    }

    return () => null;
  }

  _observeTemplate(template) {
    this._mutationObserver.disconnect();

    this._mutationObserver.observe(template, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  _cleanUpRoot() {
    if (!this._templates.length) { return; };

    this._templates.forEach(template => {
      if (!template.root) { return; }

      render((template.root.shadowRoot && template.root.shadowRoot.querySelector('[data-render-root]')) || template.root, () => html``);
    });
  }
}

export default Templater;
