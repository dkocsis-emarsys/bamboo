context('Attributes', () => {
  let component;

  beforeEach(() => {
    component = document.createElement('test-attributes');
    document.body.appendChild(component);
  });

  afterEach(() => {
    component.parentNode.removeChild(component);
  });

  it('sets attribute on component and get corrent value from property', () => {
    component.setAttribute('value', '10');
    expect(component.value).to.equal('10');
  });

  it('transforms attribute name to camelCase', () => {
    component.setAttribute('data-value', '10');
    expect(component.dataValue).to.equal('10');
  });

});
