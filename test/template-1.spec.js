context('Template (single, no options)', () => {
  let component;

  beforeEach(() => {
    component = document.createElement('test-template-1');
    document.body.appendChild(component);
  });

  afterEach(() => {
    component.parentNode.removeChild(component);
  });

  it('render template inside component', () => {
    expect(component.textContent).to.equal('Hello World !');
  });

  it('render state value inside template', () => {
    const value = 2;
    component.value = value;

    expect(component.textContent).to.equal(`Hello World ${value}!`);
  });

  it('render updated state value inside template', () => {
    let value = 2;
    component.value = value;

    expect(component.textContent).to.equal(`Hello World ${value}!`);

    value = 3;
    component.value = value;

    expect(component.textContent).to.equal(`Hello World ${value}!`);
  });

  it('adds an eventlistener to a button', () => {
    component.value = 0;
    component.querySelector('[data-handler="increase"]').click();

    expect(component.textContent).to.equal(`Hello World 1!`);
  });

  it('replace inital html content on connect', () => {
    component.value = 1;
    component.innerHTML = 'test';
    component.parentNode.removeChild(component);
    document.body.appendChild(component);
    component.value = 0;

    expect(component.textContent).to.equal(`Hello World 0!`);
  });
});
