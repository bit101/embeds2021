// const { Window, Knob, PlayButton } = mc2;


class Node {
  constructor(parent, context) {
    this._parent = parent;
    this._context = context;
    this._win = new Window(this._parent, "", 0, 0, 100, 190);
    this._connected = false;
  }

  //////////////////////////////
  // PRIVATE
  //////////////////////////////

  //////////////////////////////
  // PUBLIC
  //////////////////////////////

  move(x, y) {
    this._win.move(x, y);
    return this;
  }

  connect(target) {
    this._target = target;
    console.log(this._title);
    console.log(this._target);
    console.log(this._target.setSource);
    this._target.setSource(this);
    return this;
  }

  disconnect(target) {
    if (this._target === target) {
      this._target.setSource(null);
      this._target = null;
    }
  }

  updateConnection() {
    if (this._source) {
      this._source.updateConnection();
    } else {
      this.refreshConnection();
    }
  }

  refreshConnection() {
    if (this._target) {
      this._output.connect(this._target._input);
      this._target.refreshConnection();
    }
  }

  setSource(source) {
    this._source = source;
  }

  setTitle(title) {
    this.title = title;
    return this;
  }

  //////////////////////////////
  // GETTERS/SETTERS
  //////////////////////////////

  get title() {
    return this._title;
  }

  set title(t) {
    this._title = t;
    this._win.text = this._title;
  }
}
