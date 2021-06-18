// const { Window, Knob, Toggle } = mc2;

class DestNode extends Node {
  constructor(parent, context) {
    super(parent, context);
    this.setTitle("Destination");
    this._onActive = this._onActive.bind(this);
    this._toggle = new Toggle(this._win, 15, 85, "Active", true, this._onActive)
      .setWidth(70);
  }

  //////////////////////////////
  // PRIVATE
  //////////////////////////////
  _onActive() {
    if (this._toggle.toggled) {
      this._toggle.text = "Active";
      this._context.resume();
    } else {
      this._toggle.text = "Suspended";
      this._context.suspend();
    }
  }

  //////////////////////////////
  // PUBLIC
  //////////////////////////////

  getInput() {
    return this._context.destination;
  }
}
