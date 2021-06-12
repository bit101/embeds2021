// const { Window, Knob, Toggle } = mc2;

class GainNode extends Node {
  constructor(parent, context, gainValue) {
    super(parent, context);
    this.setTitle("Gain");
    this._gainValue = gainValue || 1;
    this._onGainChange = this._onGainChange.bind(this);
    this._onConnect = this._onConnect.bind(this);
    this._knob = new Knob(this._win, 30, 25, "Gain", this._gainValue, 0, 1, this._onGainChange)
      .setDecimals(1)
      .setSensitivity(200);
    this._toggle = new Toggle(this._win, 15, 130, "Connected", true, this._onConnect)
      .setWidth(70);
    this._gainNode = this._context.createGain();
    this._gainNode.gain.value = this._gainValue;
  }

  //////////////////////////////
  // PRIVATE
  //////////////////////////////
  _onGainChange() {
    this.setGain(this._knob.value);
  }

  _onConnect() {
    if (this._toggle.toggled) {
      this._toggle.text = "Connected";
      this.connect();
    } else {
      this._toggle.text = "Disconnected";
      this.disconnect();
    }
  }

  //////////////////////////////
  // PUBLIC
  //////////////////////////////

  connect() {
    if (!this._target) {
      return;
    }
    const input = this._target.getInput();
    if (input) {
      this._gainNode.connect(input);
    }
  }

  getInput() {
    return this._gainNode;
  }

  disconnect() {
    this._gainNode.disconnect(this._target.getInput());
    this.reset();
  }

  getGain() {
    return this.gainValue;
  }

  reset() {
    this._gainNode.gain.value = this._gainValue;
    if (this._target) {
      this._target.reset();
    }
  }

  setGain(g) {
    this._gainValue = g;
    this._knob.value = this._gainValue;
    this._gainNode.gain.value = this._gainValue;
    return this;
  }

  setMinMaxValue(min, max, value) {
    this._knob.min = min;
    this._knob.max = max;
    this._gainValue = value;
    this._knob.value = this._gainValue;
    this._gainNode.gain.value = this._gainValue;
    return this;
  }
}
