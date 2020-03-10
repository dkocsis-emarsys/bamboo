## Installation

```bash
npm i @dkocsis-emarsys/bamboo
```

## Usage

```javascript
import Bamboo from '@dkocsis-emarsys/bamboo';

class MyCustomElement extends Bamboo { ... }

customElements.define('my-custom-element', MyCustomElement);
```

Bamboo has a custom named constructor called _init_. Use it instead of the default constructor.

```javascript
class MyCustomElement extends Bamboo {
  init() {
    super.init({ ... }); // Component related options
  }
}
```