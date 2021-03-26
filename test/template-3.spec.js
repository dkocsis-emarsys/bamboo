import { expect } from 'chai';

import TestTemplate3 from './template-3';
customElements.define('test-template-3', TestTemplate3);

describe('Template (multiple)', () => {
  let component;

  beforeEach(() => {
    component = document.createElement('test-template-3');
    component.innerHTML = 'test';
    document.body.appendChild(component);
  });

  afterEach(() => {
    component.remove();
  });

  it('render template with container inside component', () => {
    expect(component.querySelector('.container-1')).not.to.be.null;
    expect(component.querySelector('.container-1').shadowRoot.textContent.trim()).to.equal('World');

    expect(component.querySelector('.container-2')).not.to.be.null;
    expect(component.querySelector('.container-2').shadowRoot.textContent.trim()).to.equal('Hello');
  });

  it('render keeps original content in element if container set', () => {
    expect(component.querySelector('.container-1')).not.to.be.null;
    expect(component.querySelector('.container-1').shadowRoot.textContent.trim()).to.equal('World');
    expect(component.querySelector('.container-2')).not.to.be.null;
    expect(component.querySelector('.container-2').shadowRoot.textContent.trim()).to.equal('Hello');
    expect(component.textContent).to.equal('test');
  });

});
