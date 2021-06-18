// const { Window, Knob, Toggle } = mc2;

class AnalyserNode extends Node {
  constructor(parent, context) {
    super(parent, context);
    this._win.setSize(700, 400);
    this.setTitle("Analyser");
    this._analyser = this._context.createAnalyser();
    this._bufferLength = this._analyser.frequencyBinCount;
    this._dataArray = new Uint8Array(this._bufferLength);
    this._analyser.getByteTimeDomainData(this._dataArray);
    this._analyser.fftSize = 2048;

    this._onToggle = this._onToggle.bind(this);
    this._toggle = new Toggle(this._win, 10, 25, "Off", false, this._onToggle);

    this._canvas = new Canvas(this._win, 0, 50, 700, 320);
    this._context = this._canvas.context;
    this._render = this._render.bind(this);
    this._render();
  }

  //////////////////////////////
  // PRIVATE
  //////////////////////////////

  _onToggle() {
    if (this._toggle.toggled) {
      this._toggle.text = "On";
    } else {
      this._toggle.text = "Off";
    }
  }

  _render() {
    requestAnimationFrame(this._render);
    if (!this._toggle.toggled) {
      return;
    }
    const w = this._canvas.width;
    const h = this._canvas.height;

    this._context.clearRect(0, 0, w, h);
    this._analyser.getByteTimeDomainData(this._dataArray);
    this._context.beginPath();

    const sliceWidth = w / this._bufferLength;
    let x = 0;

    this._context.beginPath();
    for (let i = 0; i < this._bufferLength; i++) {
      const v = this._dataArray[i] / 128.0;
      const y = v * h / 2;

      this._context.lineTo(x, y);

      x += sliceWidth;
    }

    this._context.lineTo(w, h / 2);
    this._context.stroke();
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
      this._analyser.connect(input);
    }
  }

  getInput() {
    return this._analyser;
  }
}
