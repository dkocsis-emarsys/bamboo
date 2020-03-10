# Parent-child communication

Web components not necessarily standalone, for example you won't use an &lt;option&gt; tag without &lt;select&gt;. Bamboo has a solution for this kind of problem too.

## Listening

First of all, in the parent component's constructor you have to set _listenChildren_ option to _true_. It will prepares the parent to be able to receive events from a child element.

```javascript
class ParentElement extends Bamboo {
  init() {
    super.init({
      listenChildren: true
    });
  }
}
```

## Notify

You have to do almost the same thing with the child component, except the option now called _notifyParent_. This will make the component send events on _connect, disconnect and state changes_.

```javascript
class ChildElement extends Bamboo {
  init() {
    super.init({
      notifyParent: true
    });
  }
}
```

## Connected callback

In the parent component, a new callback can be used for handling the events, _childrenChangedCallback(collection:Array)_. This callback gives back the whole list of connected children. What you doing with this data is up to you. In this example we will use it to store the child's value from it's state.

```javascript
childrenChangedCallback(collection) {
  const childrenList = collection.get();
  this._state.set('childValues', childrenList.map(child => child.state.value));
}
```

## Diversity

A parent can have multiple different kind of children and because of that the _collection_ can give back them separately. Only thing you have to do is defining a first parameter with a tag name.

```javascript
childrenChangedCallback(collection) {
  const filteredChildrenList = collection.get('my-example-2-child');
}
```
