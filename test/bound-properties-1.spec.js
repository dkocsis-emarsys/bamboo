import { expect } from 'chai';

import TestBoundProperties1 from './bound-properties-1';
customElements.define('test-bound-properties-1', TestBoundProperties1);

describe('Bound properties to state (simple)', () => {
  let component;

  beforeEach(() => {
    component = document.createElement('test-bound-properties-1');
    document.body.appendChild(component);
  });

  afterEach(() => {
    component.remove();
  });

  it('sets state on attribute set', () => {
    component.setAttribute('value', 'attribute');
    expect(component.textContent).to.equal('attribute');
  });

  it('sets state on property set', () => {
    component.value = 'property';
    expect(component.textContent).to.equal('property');
  });
});
