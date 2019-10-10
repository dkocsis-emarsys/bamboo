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
    expect(component.querySelector('.container')).not.to.be.null;
    expect(component.querySelector('.container').textContent).to.equal('Hello World !');
  });

  it('render keeps original content in element if container set', () => {
    expect(component.querySelector('.container')).not.to.be.null;
    expect(component.textContent).to.equal('Hello World !test');
  });

  it('render state value inside template', () => {
    const value = 2;
    component.value = value;

    expect(component.querySelector('.container').textContent).to.equal(`Hello World ${value}!`);
  });

  it('render updated state value inside template', () => {
    let value = 2;
    component.value = value;

    expect(component.querySelector('.container').textContent).to.equal(`Hello World ${value}!`);

    value = 3;
    component.value = value;

    expect(component.querySelector('.container').textContent).to.equal(`Hello World ${value}!`);
  });
});
