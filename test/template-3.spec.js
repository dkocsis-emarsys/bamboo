context('Template (multiple)', () => {
  let component;

  beforeEach(() => {
    component = document.createElement('test-template-3');
    component.innerHTML = 'test';
    document.body.appendChild(component);
  });

  afterEach(() => {
    component.parentNode.removeChild(component);
  });

  it('render template with container inside component', () => {
    expect(component.querySelector('.container-1')).not.to.be.null;
    expect(component.querySelector('.container-1').textContent).to.equal('World');

    expect(component.querySelector('.container-2')).not.to.be.null;
    expect(component.querySelector('.container-2').textContent).to.equal('Hello');
  });

  it('render keeps original content in element if container set', () => {
    expect(component.querySelector('.container-1')).not.to.be.null;
    expect(component.querySelector('.container-2')).not.to.be.null;
    expect(component.textContent).to.equal('HellotestWorld');
  });

});
