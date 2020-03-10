# Handling attributes

Add _observedAttributes_ getter to the component to listen on a list of attributes just like you do with native implementation.

```javascript
static get observedAttributes() {
  return ['data-value'];
}
```

Properties are auto-magically created. If the attribute contains hyphen (-) then the property name will be in camelCase form, e.g.: _data-value_ attribute becomes _dataValue_ property.

```javascript
static get observedAttributes() {
  return ['data-value'];
}

set dataValue(value) { ... }
get dataValue() { ... }
```
