// const { Window, Knob, PlayButton } = mc2;


class OscNode extends Node {
  constructor(parent, context, frequency, type) {
    super(parent, context);
    this.setTitle("Oscillator");
    this._frequency = frequency || 440;
    this._type = type || "sine";
    this._onFrequency = this._onFrequency.bind(this);
    this._onPlay = this._onPlay.bind(this);
    this._knob = new Knob(this._win, 30, 30, "Frequency", this._frequency, 0, 2000, this._onFrequency);
    this._playButton = new PlayButton(this._win, 30, 115, false, this._onPlay);
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

  //////////////////////////////
  // PUBLIC
  //////////////////////////////

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
    this._osc.type = this._type
    this._input = this._osc.frequency;
    this._output = this._osc;
    this.updateConnection();
    this._osc.start();
    return this;
  }

  stop() {
    this._playButton.playing = false;
    this._osc.stop();
    this._osc = null;
    this._input = null;
    return this;
  }
}
