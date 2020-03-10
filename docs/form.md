# Forms

## Defaults

You can make any component behave like a normal form element by define _static get formAssociatedElement()_ getter in your element.

> There is a much better way defining elements as form elements in Chrome using native methods.\
> [Form-associated custom elements](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-face-example)

```javascript
static get formAssociatedElement() {
  return true;
}

static get observedAttributes() {
  // You have to concat your list to formAssociatedAttributes
  return this.constructor.formAssociatedAttributes.concat(['test']);
}
```

## Setting values

Value setting can be done as a value attribute setting on the element or using _this.\_internals_ state.

```html
<!-- Setting attributes as a regular input element -->
<my-input name="input" value="2" disabled readonly></my-input>
```

```javascript
_onButtonClick(event) {
  // Setting manually with method
  this._internals.set('name', 'input');
  this._internals.set('value', 2);
  this._internals.set('disabled', false);
  this._internals.set('readonly', false);
}
```

## Accessing containing form

You can access the form element owns the component through the form property from the element or using _this.\_internals_.

```javascript
this._internals.get('form');
```
