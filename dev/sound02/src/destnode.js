// const { Window, Knob, Toggle } = mc2;


class DestNode extends Node {
  constructor(parent, context) {
    super(parent, context);
    this.setTitle("Destination");
    this._onActive = this._onActive.bind(this);
    this._toggle = new Toggle(this._win, 25, 70, "Active", true, this._onActive);
    this._input = this._context.destination;
    this._output = this._context;
  }

  //////////////////////////////
  // PRIVATE
  //////////////////////////////
  _onActive() {
    if (this._toggle.toggled) {
      this._context.resume();
    } else {
      this._context.suspend();
    }
  }

  //////////////////////////////
  // PUBLIC
  //////////////////////////////
}
