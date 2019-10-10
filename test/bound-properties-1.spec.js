context('Bound properties to state (simple)', () => {
  let component;

  beforeEach(() => {
    component = document.createElement('test-bound-properties-1');
    document.body.appendChild(component);
  });

  afterEach(() => {
    component.parentNode.removeChild(component);
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
