import { expect } from 'chai';

import TestTemplate1 from './template-1';
customElements.define('test-template-1', TestTemplate1);

describe('Template (single, no options)', () => {
  let component;

  beforeEach(() => {
    component = document.createElement('test-template-1');
    document.body.appendChild(component);
  });

  afterEach(() => {
    component.remove();
  });

  it('render template inside component', () => {
    expect(component.shadowRoot.textContent.trim()).to.equal('Hello World 0!');
  });

  it('render state value inside template', () => {
    const value = 2;
    component.value = value;

    expect(component.shadowRoot.textContent.trim()).to.equal(`Hello World ${value}!`);
  });

  it('render updated state value inside template', () => {
    let value = 2;
    component.value = value;

    expect(component.shadowRoot.textContent.trim()).to.equal(`Hello World ${value}!`);

    value = 3;
    component.value = value;

    expect(component.shadowRoot.textContent.trim()).to.equal(`Hello World ${value}!`);
  });

  it('adds an eventlistener to a button', () => {
    component.value = 0;
    component.shadowRoot.querySelector('[data-handler="increase"]').click();

    expect(component.shadowRoot.textContent.trim()).to.equal(`Hello World 1!`);
  });

  it('replace inital html content on connect', () => {
    component.value = 1;
    component.innerHTML = 'test';
    component.parentNode.removeChild(component);
    document.body.appendChild(component);
    component.value = 0;

    expect(component.shadowRoot.textContent.trim()).to.equal(`Hello World 0!`);
  });
});
