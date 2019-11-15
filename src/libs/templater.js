import { html, svg, render } from 'lighterhtml';

class Templater {
  constructor(context) {
    this._context = context;
    this._templates = [];
    this._mutationObserver = new MutationObserver(this._context.contentChangedCallback.bind(this));
  }

  init() {
    if (typeof this._context.template === 'object') {
      this._context.template.forEach(template => this._templates.push(template));
    } else if (this._context.template) {
      this._templates = [{
        name: '_default',
        markup: this._context.template,
        container: this._context.constructor.formAssociatedElement ? document.createElement('div') : this._context,
        autoAppend: true
      }];
    }
  }

  add(template) {
    this._templates.push({
      name: template.name,
      markup: template.markup,
      container: template.container,
      autoAppend: template.autoAppend || false,
      prepend: template.prepend || false
    });
  }

  parseHTML(content) {
    return new DOMParser().parseFromString(content, 'text/html').body.childNodes[0];
  }

  connect() {
    this._cleanUpContainer();

    this._templates.forEach(template => {
      if (template.container && template.container !== this._context) {
        template.container.setAttribute('data-render-container', '');

        if (!template.autoAppend) { return; }

        if (template.prepend) {
          this._context.insertAdjacentElement('afterbegin', template.container);
        } else {
          this._context.appendChild(template.container);
        }
      }
    });
  }

  disconnect() {
    this._templates.forEach(template => {
      if (template.container && template.container !== this._context) {
        template.container.parentNode.removeChild(template.container);
      }
    });
  }

  render(templateName = '_default') {
    return this._render(templateName);
  }

  renderAll() {
    this._templates.forEach(template => {
      if (template.markup && template.container) {
        render(template.container, this._render(template.name));
      }
    });
  }

  getContainer(templateName = '_default') {
    return this._templates.find(template => template.name === templateName).container;
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

  _cleanUpContainer() {
    if (!this._templates.length) { return; };

    this._templates.forEach(template => {
      if (!template.container) { return; }

      render(template.container, () => html``);
    });
  }
}

export default Templater;
