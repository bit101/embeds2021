// const { Window, Knob, PlayButton } = mc2;

class Node {
  constructor(parent, context) {
    this._parent = parent;
    this._context = context;
    this._win = new Window(this._parent, "", 0, 0, 100, 230);
    this._connected = false;
  }

  //////////////////////////////
  // PRIVATE
  //////////////////////////////

  //////////////////////////////
  // PUBLIC
  //////////////////////////////

  connect() {
    // override in subclasses
  }

  getInput() {
    // override in subclasses
  }

  reset() {
    // override in subclasses
  }

  move(x, y) {
    this._win.move(x, y);
    return this;
  }

  getSource() {
    return this._source;
  }

  setSource(source) {
    this._source = source;
  }

  getTarget() {
    return this._target;
  }

  setTarget(target) {
    this._target = target;
    this._target.setSource(this);
    this.connect();
  }

  getTitle() {
    return this._title;
  }

  setTitle(title) {
    this.title = title;
    this._win.text = title;
    return this;
  }
}
