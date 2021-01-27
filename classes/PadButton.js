// class Launchpad
import WebMidi from 'webmidi';

class PadButton {
	constructor(options) {
		this.type = null; // set by subclass constructor
		this.midiNote = options.midiNote || null;
		this.midiVel = options.midiVel || 0;
		this.midiOn = options.midiOn || false;
		this.index = options.index;
		this.output = options.output || null;

		this.setType = this.setType.bind(this);
		this.getType = this.getType.bind(this);
		this.setVelocity = this.setVelocity.bind(this);
		this.getVelocity = this.getVelocity.bind(this);
		this.setNoteOn = this.setNoteOn.bind(this);
		this.getNoteOn = this.getNoteOn.bind(this);
		this.getIndex = this.getIndex.bind(this);
		this.getState = this.getState.bind(this);
	}

	setType(type) {
		this.type = type;
	}
	getType() {
		return this.type;
	}

	setOutput(midiPort) {
		this.output = midiPort;
	}

	setVelocity(vel) {
		if (vel >= 0 && vel <=127) {
			this.midiVel = vel;
		}
	}

	getVelocity() {
		return this.midiVel;
	}

	setNoteOn(on=true) {
		this.midiOn = !!on;
	}

	getNoteOn() {
		return this.midiOn;
	}

	getIndex(dir=false, includeControls=false) {
		if (!dir) return this.index;
		else {
			// if N, NW, NE and not the top row, newRow = this.row + 1, else if is top row, return -1
			// if S, SW, SE and not the bottom row, newRow = this.row - 1, else if is bottom row, return -1
			// if E, NE, SE, and not right col, newCol = this.col + 1, else if is right col, return -1
			// if W, NW, SW, and not left col, newCol = this.col - 1, else if is left col, return -1
			// return newRow * 10 + newCol;
		}
	}

	getState() {
		return [this.index, this.midiOn, this.midiVel, this.type];
	}
	setState(opts) {
		if (opts.length >= 3 && opts[0] === this.index) {
			if (opts[1]) this.setNoteOn(opts[1]);
			if (opts[2]) this.setVelocity(opts[2]);
		}
	}
}

export default PadButton;