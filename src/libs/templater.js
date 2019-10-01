import { html, render } from 'lighterhtml';

class Templater {
  constructor(context) {
    this._context = context;
    this._templates = [];
    this._mutationObserver = new MutationObserver(this._context.contentChangedCallback.bind(this));
  }

  init(templates) {
    if (typeof templates === 'object') {
      templates.forEach(template => this._templates.push(template));
    } else if (templates) {
      this._templates = [{
        name: '_default',
        markup: templates,
        container: this._context,
        autoAppendContainer: true
      }];
    }
  }

  parseHTML(content) {
    return new DOMParser().parseFromString(content, 'text/html').body.childNodes[0];
  }

  connect() {
    this._cleanUpContainer();

    this._templates.forEach(template => {
      if (template.container && template.container !== this._context) {
        template.container.setAttribute('data-render-container', '');

        if (!template.autoAppendContainer) { return; }

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

  renderAll() {
    this._templates.forEach(template => {
      if (template.markup && template.container) {
        render(template.container, this.render(template.name));
      }
    });
  }

  render(templateName = '_default') {
    const markup = this._templates.find(template => template.name === templateName).markup;

    if (typeof markup === 'function') {
      return markup.bind(this._context, html);
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

  getContainer(templateName = '_default') {
    return this._templates.find(template => template.name === templateName).container;
  }

  buildFromTemplate(template) {
    this._observeTemplate(template);

    return render => {
      const innerHTML = [].map.call(template.childNodes, x => x.outerHTML).join('');

      const variableRegexp = /(\$\{[\w\.]+\})/g
      const templateValues = innerHTML.split(variableRegexp).reduce((values, item) => {
        if ('$' === item[0] && '{' === item[1] && '}' === item.slice(-1)) {
          values.keys.push(item.slice(2, -1));
        } else {
          values.markup.push(item);
        }

        return values;
      }, { markup: [], keys: [] });

      templateValues.id = ':' + templateValues.markup.join().trim();

      const output = [
        templateValues.markup,
        ...templateValues.keys.map(key => this._context._state.get(key))
      ];
      output.raw = { value: templateValues.markup };

      return html(...output);
    };
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
    const containers = this._context.querySelectorAll('[data-render-container]');
    Array.from(containers).forEach(node => node.parentNode.removeChild(node));

    this._templates.forEach(template => {
      if (!template.container) { return; }

      render(template.container, () => html``);
    });
  }
}

export default Templater;
