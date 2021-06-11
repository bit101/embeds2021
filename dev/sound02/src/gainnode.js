// const { Window, Knob, Toggle } = mc2;

class GainNode extends Node {
  constructor(parent, context, gainValue) {
    super(parent, context);
    this.setTitle("Gain");
    this._gainValue = gainValue || 1;
    this._onGainChange = this._onGainChange.bind(this);
    this._onConnect = this._onConnect.bind(this);
    this._knob = new Knob(this._win, 30, 30, this._title, this._gainValue, 0, 1, this._onGainChange)
      .setDecimals(2);
    this._toggle = new Toggle(this._win, 25, 115, "Connected", true, this._onConnect);
    this._gainNode = this._context.createGain();
    this._gainNode.gain.value = this._gainValue;
    this._input = this._gainNode;
    this._output = this._gainNode;
  }

  //////////////////////////////
  // PRIVATE
  //////////////////////////////
  _onGainChange() {
    this.setGain(this._knob.value);
  }

  _onConnect() {
    this.updateConnection();
    // if (!this._target || !this._target.input) {
    //   return;
    // }
    // if (this._toggle.toggled) {
    //   if (!this._connected) {
    //     this._gainNode.connect(this._target.input);
    //     this._connected = true;
    //   }
    // } else {
    //   if (this._connected) {
    //     this._gainNode.disconnect(this._target.input);
    //     this._connected = false;
    //   }
    // }
  }

  //////////////////////////////
  // PUBLIC
  //////////////////////////////

  getGain() {
    return this.gainValue;
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
    this.gain = value;
    return this;
  }
}
