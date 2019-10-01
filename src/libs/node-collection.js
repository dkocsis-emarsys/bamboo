export default class NodeCollection {
  constructor() {
    this._nodes = [];
  }

  get(type = '') {
    if (!type) { return this._nodes.map(node => node); }

    return this._nodes.filter(node => node.element.nodeName === type.toUpperCase());
  }

  upsert(id, element, state, idKey = 'id') {
    const storedNode = this._nodes.find(storedNode => storedNode[idKey] === id);

    if (storedNode) {
      const nodeIndex = this._nodes.indexOf(storedNode);
      this._nodes[nodeIndex] = {id, element, state};
    } else {
      this._nodes.push({id, element, state});
    }
  }

  remove(id, element, state, idKey = 'id') {
    this._nodes = this._nodes.filter(storedNode => storedNode[idKey] !== id);
  }
}
