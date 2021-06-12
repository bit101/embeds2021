// const { Window, Knob, PlayButton } = mc2;

class FilterNode extends Node {
  constructor(parent, context, frequency, type) {
    super(parent, context);
    this.setTitle("Filter");
    this._frequency = frequency || 440;
    this._gain = 0;
    this._detune = 0;
    this._q = 1;
    this._type = type || "lowpass";

    this._onFrequency = this._onFrequency.bind(this);
    this._onType = this._onType.bind(this);
    this._onGain = this._onGain.bind(this);
    this._onDetune = this._onDetune.bind(this);
    this._onQ = this._onQ.bind(this);

    this._filterKnob = new Knob(this._win, 10, 25, "Freq", this._frequency, 0, 2000, this._onFrequency)
      .setDecimals(1)
      .setSize(35);
    this._gainKnob = new Knob(this._win, 55, 25, "Gain", this._gain, -40, 40, this._onGain)
      .setDecimals(1)
      .setSize(35)
      .setEnabled(false);
    this._detuneKnob = new Knob(this._win, 10, 100, "Detune", this._detune, -100, 100, this._onDetune)
      .setDecimals(1)
      .setSize(35);
    this._qKnob = new Knob(this._win, 55, 100, "Q", this._q, 0.1, 100, this._onQ)
      .setDecimals(1)
      .setSize(35)
      .setEnabled(true);
    const types = ["lowpass", "highpass", "bandpass", "lowshelf", "highshelf", "peaking", "notch", "allpass"];
    this._dropdown = new Dropdown(this._win, 10, 170, types, 0, this._onType)
      .setWidth(80)
      .setDropdownPosition("top");
    this._filterNode = this._context.createBiquadFilter();
    this._filterNode.type = this._type;
    this._filterNode.frequency.value = this._frequency;
  }

  //////////////////////////////
  // PRIVATE
  //////////////////////////////
  _onFrequency() {
    this.setFrequency(this._filterKnob.value);
  }

  _onGain() {
    this.setGain(this._gainKnob.value);
  }

  _onDetune() {
    this.setDetune(this._detuneKnob.value);
  }

  _onQ() {
    this.setQ(this._qKnob.value);
  }

  _onType() {
    this.setType(this._dropdown.text);
    if (this._type === "lowshelf" || this._type === "highshelf" || this._type === "peaking") {
      this._gainKnob.enabled = true;
    } else {
      this._gainKnob.enabled = false;
    }
    if (this._type === "lowshelf" || this._type === "highshelf") {
      this._qKnob.enabled = false;
    } else {
      this._qKnob.enabled = true;
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
      this._filterNode.connect(input);
    }
  }

  getInput() {
    return this._filterNode;
  }

  getFrequency() {
    return this._frequency;
  }

  setFrequency(f) {
    this._frequency = f;
    this._filterNode.frequency.value = this._frequency;
    return this;
  }

  getDetune() {
    return this._detune;
  }

  setDetune(d) {
    this._detune = d;
    this._filterNode.detune.value = this._detune;
    return this;
  }

  getQ() {
    return this._q;
  }

  setQ(q) {
    this._q = q;
    this._filterNode.Q.value = this._q;
    return this;
  }

  getGain() {
    return this._gain;
  }

  setGain(g) {
    this._gain = g;
    this._filterNode.gain.value = this._gain;
    return this;
  }

  setMinMaxValue(min, max, value) {
    this._filterKnob.min = min;
    this._filterKnob.max = max;
    this._frequency = value;
    this._filterKnob.value = value;
    this._filterNode.frequency.value = value;
    return this;
  }

  getType() {
    return this._type;
  }

  setType(type) {
    this._type = type;
    this._filterNode.type = type;
  }
}
