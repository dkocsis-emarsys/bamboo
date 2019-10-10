context('Bound properties to state (complex)', () => {
  let component;

  beforeEach(() => {
    component = document.createElement('test-bound-properties-2');
    document.body.appendChild(component);
  });

  afterEach(() => {
    component.parentNode.removeChild(component);
  });

  it('use different name in state', () => {
    component.setAttribute('data-value', 'attribute');
    expect(component.textContent).to.equal('attribute');
  });

  it('won\'t trigger callback', () => {
    component.triggerCallback = 'nope';
    expect(component.textContent).to.equal('');
  });

  it('won\'t trigger render', () => {
    component.triggerRender = 'nope';
    expect(component.textContent).not.to.equal('nope');
  });

  it('store function in state', () => {
    component.dataValue = 'uppercase';
    component.storeFunction = value => value.toUpperCase();
    expect(component.textContent).to.equal('UPPERCASE');
  });
});
