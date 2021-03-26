import { expect } from 'chai';

import TestTemplate2 from './template-2';
customElements.define('test-template-2', TestTemplate2);

const getContainer = component => {
  return component.querySelector('.container');
};

const getShadowRoot = component => {
  return getContainer(component).shadowRoot;
};

describe('Template (single, with options)', () => {
  let component;

  beforeEach(() => {
    component = document.createElement('test-template-2');
    component.innerHTML = 'test';
    document.body.appendChild(component);
  });

  afterEach(() => {
    component.remove();
  });

  it('render template with container inside component', () => {
    expect(getContainer(component)).not.to.be.null;
    expect(getShadowRoot(component).textContent.trim()).to.equal('Hello World !');
  });

  it('render keeps original content in element if container set', () => {
    expect(getContainer(component)).not.to.be.null;
    expect(getShadowRoot(component).textContent.trim()).to.equal('Hello World !');
    expect(component.textContent.trim()).to.equal('test');
  });

  it('render state value inside template', () => {
    const value = 2;
    component.value = value;

    expect(getShadowRoot(component).textContent.trim()).to.equal(`Hello World ${value}!`);
  });

  it('render updated state value inside template', () => {
    let value = 2;
    component.value = value;

    expect(getShadowRoot(component).textContent.trim()).to.equal(`Hello World ${value}!`);

    value = 3;
    component.value = value;

    expect(getShadowRoot(component).textContent.trim()).to.equal(`Hello World ${value}!`);
  });
});
