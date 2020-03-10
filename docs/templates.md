# Tamplates

## Basics

Templating has never been easier than it is now with Bamboo. Just define a _template_ getter on the component. And of course you can use your own templating engine.

```javascript
get template() {
  return html => html`Hello Bamboo!`;
}
```

> Bamboo uses shadowDOM by default, but it can be easily changed with an option.

> The template system uses **lighterhtml** package for rendering, but you can use something else if you want.

The component can apply classes to itself with the _className_ option if needed. The parameter is a string and multiple classes can be append with a space between classes.

```javascript
init() {
  super.init({
    className: 'my-custom-element my-custom-element--dark'
  });
}
```

> Be careful with it because it only applies once at initialization.

## Configuring

Templating has a lot of powerful options. If you return an array of objects, then you can fully customize your templates.

```javascript
get template() {
  return [
    {
      name: 'hello',
      markup: templateFromFile,
      root: document.createElement('div'),
      useShadow: true,
      openShadow: true,
      autoAppend: true,
      prepend: true
    }
  ];
}
```

| Option name | Valid values | Default value | Description |
| ----------- | ----------- | ----------- | ----------- |
| name | String | It has no default value, because it's not optional | The name of the template partial |
| markup | DocumentFragment, HTMLElement, String, CSS selector | It has no default value, because it's not optional | Defines the actual content of the template |
| root | HTMLElement | this | Defines the element where the markup rendered in |
| useShadow | Boolean | true | This option toggles between using shadow DOM or real DOM |
| openShadow | Boolean | true | If useShadow enabled, it sets wether it can be accessed by script or not |
| autoAppend | Boolean | false | If sets to true, then automatically appends the root element to the component |
| prepend | Boolean | false | Use prepend instead of append when autoAppend enabled |

## Manually render templates

It's not required for templates to be used instantly. They can be configured and used later on just skip the autoAppend option.

```javascript
get template() {
  return [
    {
      name: 'hello',
      markup: html => html`Hello template`
    }
  ];
}

append() {
  const helloTemplate = this._templater.render('hello');
  const fragment = helloTemplate();

  this.appendChild(fragment);
}
```

> Calling the _this.\_templater.render(templateName:string)_ function gives back a document fragment.

## Markup

You can check if the markup of a template exists. It can be really useful, when your markup came from somewhere else.

```javascript
get template() {
  return [
    {
      name: 'hello',
      markup: this.querySelector('[data-label]')
    }
  ];
}

_isMarkupExists() {
  return this._templater.hasMarkup('hello');
}
```

Markup can be changed on-the-fly with _this.\_templater.setMarkup(templateName:String, markup:any)_ function.


```javascript
this._templater.setMarkup('hello', node);
```

## Multiple templates

This is what you simply can't see everywhere on the market. The _template_ getter is an array for this reason.

Templates can easily connect to eachother using _this.\_templater.render()_ method.

```javascript
get template() {
  return [
    {
      name: 'hello',
      markup: html => html`Hello ${this._templater.render('world')()}!`,
      root: this._templater.parseHTML('<div class="hello-root"></div>'),
      autoAppend: true
    },
    {
      name: 'world',
      markup: html => html`<strong>World</strong>`
    }
  ];
}
```

> Calling the _this.\_templater.parseHTML(htmlString:String)_ function gives back a real node.

## Using existing nodes as template

Another interesting and useful part of the templating system is the ability to define templates in the DOM. State variables can be used as well.

```html
<my-component>
  <template>Hello ${value}!</template>
</my-component>
```

```javascript
get template() {
  return [
    {
      name: 'hello',
      markup: this.querySelector('template'),
      root: document.createElement('div'),
      autoAppend: true
    }
  ];
}
```

## Event handling

Event handling is always something, what causing problems and makes our code much complex. With Bamboo, this problem becomes much less painful. You can define a _static get eventHandlers()_ getter.

```javascript
static get eventHandlers() {
  return {
    ':click': '_onClick'
  }
}

_onClick(event) { ... }
```

They can be created through templates too using _data-handler_ attribute and the event binding to the context.

```javascript
static get eventHandlers() {
  return {
    'button:click': '_onButtonClick'
  }
}

get template() {
  return html => html`<button data-handler="button" onclick="${this}">Click Me!</button>`;
}

_onButtonClick(event) { ... }
```
