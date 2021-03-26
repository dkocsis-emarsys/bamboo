import { expect } from 'chai';

import TestForm1 from './form-1';
customElements.define('test-form-1', TestForm1);

describe('Form', () => {
  let component;
  let form;

  beforeEach(() => {
    form = document.createElement('form');
    component = document.createElement('test-form-1');
    form.appendChild(component);
    document.body.appendChild(form);
  });

  afterEach(() => {
    component.remove();
  });

  it('gets the value set in attribute', () => {
    const value = 'lorem';
    component.setAttribute('value', value);
    expect(component.value).to.equal(value);
  });

  it('gets the name set in attribute', () => {
    const name = 'lorem';
    component.setAttribute('name', name);
    expect(component.name).to.equal(name);
  });

  it('gets the disabled set in attribute', () => {
    component.setAttribute('disabled', '');
    expect(component.disabled).to.equal(true);
  });

  it('gets the disabled value after removed', () => {
    component.removeAttribute('disabled');
    expect(component.disabled).to.equal(false);
  });

  it('gets the readonly set in attribute', () => {
    component.setAttribute('readonly', '');
    expect(component.readonly).to.equal(true);
  });

  it('gets the readonly value after removed', () => {
    component.removeAttribute('readonly');
    expect(component.readonly).to.equal(false);
  });

  it('gets the form element of the input', () => {
    expect(component.form).to.equal(form);
  });
});
