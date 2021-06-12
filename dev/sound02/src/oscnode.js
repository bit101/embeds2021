// const { Window, Knob, PlayButton } = mc2;

class OscNode extends Node {
  constructor(parent, context, frequency, type) {
    super(parent, context);
    this.setTitle("Oscillator");
    this._frequency = frequency || 440;
    this._type = type || "sine";
    this._onFrequency = this._onFrequency.bind(this);
    this._onPlay = this._onPlay.bind(this);
    this._onType = this._onType.bind(this);
    this._knob = new Knob(this._win, 30, 25, "Frequency", this._frequency, 0, 2000, this._onFrequency)
      .setDecimals(1)
      .setSensitivity(200);
    const types = ["sine", "triangle", "square", "sawtooth"];
    this._dropdown = new Dropdown(this._win, 10, 110, types, 0, this._onType)
      .setWidth(80)
      .setDropdownPosition("top");
    this._playButton = new PlayButton(this._win, 30, 155, false, this._onPlay);
  }

  //////////////////////////////
  // PRIVATE
  //////////////////////////////
  _onFrequency() {
    this.setFrequency(this._knob.value);
  }

  _onPlay() {
    if (this._playButton.playing) {
      this.start();
    } else {
      this.stop();
    }
  }

  _onType() {
    this.setType(this._dropdown.text);
  }

  //////////////////////////////
  // PUBLIC
  //////////////////////////////

  connect() {
    if (!this._target) {
      return;
    }
    if (!this._osc) {
      return;
    }
    const input = this._target.getInput();
    if (input) {
      this._osc.connect(input);
    }
  }

  disconnect() {
    if (!this._target) {
      return;
    }
    if (!this._osc) {
      return;
    }
    const input = this._target.getInput();
    this._osc && this._osc.disconnect(input);
    this._target.reset();
  }

  getInput() {
    if (this._osc) {
      return this._osc.frequency;
    }
    return null;
  }

  reset() {
    if (this._osc) {
      this._osc.frequency.value = this._frequency;
    }
    if (this._target) {
      this._target.reset();
    }
  }

  getFrequency() {
    return this._frequency;
  }

  setFrequency(f) {
    this._frequency = f;
    if (this._osc) {
      this._osc.frequency.value = this._frequency;
    }
    return this;
  }

  getType() {
    return this._type;
  }

  setType(type) {
    this._type = type;
    if (this._osc) {
      this._osc.type = this._type;
    }
  }

  setMinMaxValue(min, max, value) {
    this._knob.min = min;
    this._knob.max = max;
    this.frequency = value;
    return this;
  }

  start() {
    if (this._osc) {
      return;
    }
    this._playButton.playing = true;
    this._osc = this._context.createOscillator();
    this._osc.frequency.value = this._frequency;
    this._osc.type = this._type;
    this.connect();
    this._source && this._source.connect();
    this._osc.start();
    return this;
  }

  stop() {
    this._playButton.playing = false;
    this._osc.stop();
    this.disconnect();
    this._osc = null;
    return this;
  }
}
