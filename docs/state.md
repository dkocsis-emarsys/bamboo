# State management

## Basics

> State management uses an another package called _bamboo-state_.

Every component has it's own state. They can be written, read or subscribed on and every state value setting triggers rendering.

You can access components state through _this.\_state_ class.

```javascript
this._state.set('dataValue', 1); // Sets value on local state
this._state.get('dataValue'); // Gets value from local state
```

If you don't want to trigger a subscription callback for the value change, set _triggerSubscriptionCallback_ option to false.

```javascript
this._state.set('dataValue', 1, {
  triggerSubscriptionCallback: false
});
```

You can skip rendering too just set _triggeRenderCallback_ option to false.

```javascript
this._state.set('dataValue', 1, {
  triggerRenderCallback: false
});
```

You can also set default values here.

```javascript
this._state.set('dataValue', 1, {
  defaultValue: 2
});
```

A transform function can be also passed as value. Perfect for incrementing/decrementing values.

```javascript
this._state.set('dataValue', (value, [defaultValue]) => ++value, { isTransformFunction: true });
```

It has the ability to nest values by using dots.

```javascript
this._state.set('group.value', 1);

this._state.get('group.value'); // Gets 1
this._state.get('group');       // Gets { value: 1 }
this._state.get();              // Gets { group: { value: 1 } }
```

## Subscription

With the awesome subscription system, you will always know, what's happening.

```javascript
this._state.subscribe('dataValue', console.log);
this._state.set('dataValue', 1); // Logs '1 "dataValue"'
```

Same subscription function can be used by passing an array.

```javascript
this._state.subscribe(['firstName', 'lastName'], console.log);
this._state.set('firstName', 'John'); // Logs 'John firstName'
this._state.set('lastName', 'Doe'); // Logs 'Doe lastName'
```

Every subscription comes with an unsubscribe method.

```javascript
const subscription = this._state.subscribe('dataValue', console.log);
this._state.set('dataValue', 1); // Logs '1 "dataValue"'

subscription.unsubscribe();
this._state.set('dataValue', 1); // No logs
```

## Options

There is two ways for setting state options. The forst one is define a _static get stateOptions()_ getter.

```javascript
static get stateOptions() {
  return {
    value: { ... }
  }
}
```

And the other way is using the _this.\_state.setOptions(name:String, value:Object)_ method.

```javascript
this._state.setOptions('dataValue', { ... });
```

State values can be formatted. Transforming has some predefined options, these are _number, integer, float, boolean, json_. When using one of these, user defined transformFunction won't be called.

```javascript
this._state.setOptions('dataValue', {
  type: 'custom',
  transformFunction: value => Number(value).toFixed(1)
});
```

## Default value

If you defined a default value for the state variable, you can access it with calling _this.\_state.getDefaultValue(name:String)_ function.

```javascript
this._state.setOptions('dataValue', {
  defaultValue: 1
});

this._state.getDefaultValue('dataValue'); // Gets 1
```

> Default values can be set in the _static get stateOptions()_ getter too.

## Initial value

Initial values are values on the state, when a component created. It also sets the default values.

```javascript
static get initialState() {
  return {
    value: 10
  };
}

this._state.get('value'); // Gets 10
this._state.getDefaultValue('value'); // Also gets 10
```

## Binding properties to state

Connections between properties and state can be easily made by defining _static get boundProperties()_ getter.

```javascript
static get observedAttributes() {
  return ['data-value'];
}

static get boundProperties() {
  return ['dataValue'];
}

getValue() {
  this._state.get('dataValue'); // It's available now on state
}
```

Another interesting option is that you can tell the component to store the value with a different name in state.

```javascript
static get observedAttributes() {
  return ['data-value'];
}

static get boundProperties() {
  return [
    {
      name: 'dataValue',
      as: 'value'
    }
  ];
}
```

If you don't want to notify the parent on every state change you can define it. It's useful when the parent sets this value on the component, so it won't report back the change.

```javascript
static get boundProperties() {
  return [
    {
      name: 'value',
      options: {
        triggerSubsriptionCallback: false
      }
    }
  ];
}
```
