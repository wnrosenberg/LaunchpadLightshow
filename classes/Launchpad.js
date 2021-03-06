// class Launchpad
import JZZ from 'jzz';
import PadButton from './PadButton';
import PadData from '../data/pads.js';
import * as grid from '../helpers/grid.js';
import {
  getMsg,
  TYPE_MODE_SET,
  TYPE_LAYOUT_SET,
  TYPE_PAD_COLOR,
  TYPE_GRID_COLOR,
} from '../helpers/message.js';

class Ctrl extends PadButton {
  constructor(options) {
    super(options);
    this.setType('ctrl');

    this.name = options.name;

    this.getControlName = this.getControlName.bind(this);
  }
  getControlName() {
    return this.name;
  }
}

class Pad extends PadButton {
  constructor(options) {
    super(options);
    this.setType('note');
  }   
}

class Launchpad {
  constructor() {
    console.log("U made a Launchpad");

    // Logs msg to the console.
    this.logger = (msg, i) => {
      let index = i !== undefined ? `[${i}]` : '';
      console.log(`msg${index}: ${msg.toString()}`);
    };

    // State
    this.notes = {ctrl: [], pad: []};
    this.pads = [];
    this.padsReady = false;

    this.in = null; // primary input, or null to listen on all
    this.out = null; // default out to send noteOn

    this.logInputs = this.logInputs.bind(this);

    this.deviceInit();
  }

  setAllPadsOff(sidetoo = false) {
    if (this.out) {
      this.out.send(getMsg(TYPE_GRID_COLOR, [0]));
      if (sidetoo) {
        this.out.send(getMsg(TYPE_PAD_COLOR, [0x63, 0]));
      }
    }
  };

  logInputs() {
    let input;
    for (let i = 0; i < JZZ().info().inputs.length; i++) {
      input = JZZ().openMidiIn(i);
      input.connect(this.logger);
    }
  };

  deviceInit() {
    const self = this;
    JZZ({sysex: true}).or('Cannot start MIDI engine!').and(function(){
      console.log('JZZ initialized', JZZ().info());
      self.logInputs(); // console.log all input port messages
      self.out = JZZ().openMidiOut(1);

      // Set to programmer layout if it isn't already.
      // this.out.send(getMsg(TYPE_MODE_SET, 1)); // set to standalone if in ableton mode
      self.out.send(getMsg(TYPE_LAYOUT_SET, 3)); // set to programmer layout if in another

      // Reset all pads to OFF
      self.setAllPadsOff();

      // Set "all pads off" as the current grid state.
      self.resumeGridState(grid.getInitialState());

      // initalize the rest of this app.
      runInit();
    });
  }

  


  // onMidiPortConnected(event) {
  //   // Launchpad has 6 ports.
  //   if (event.port.type === 'input') {
  //     this.inputs.push(event.port);
  //   }
  //   if (event.port.type === 'output') {
  //     this.outputs.push(event.port);
  //     if (event.port.id === 'output-2') {
  //       this.out = event.port;
  //     }
  //   }
  //   // If all are connected, we are ready to go.
  //   if (this.inputs.length + this.outputs.length === 6) {
  //     this.midiReady = true;
  //     console.log('LAUNCHPAD READY');
  //     this.onMidiReady();
  //   }
  // };
  // onWebMidiEnabled(err) {
  //   if (err) {
  //     console.error("WebMidi could not be enabled, continuing with standard experience.", err);
  //   } else {
  //     this.midiEnabled = true;
  //     if (WebMidi.inputs.length + WebMidi.outputs.length === 6) {
  //       console.log('ports already connected');
  //       // ports already connected.
  //       this.inputs = [...WebMidi.inputs];
  //       this.outputs = [...WebMidi.outputs];
  //       this.out = WebMidi.outputs[1];
  //       this.midiReady = true;
  //       console.log('LAUNCHPAD READY');
  //       this.onMidiReady();
  //     } else {
  //       WebMidi.addListener("connected", this.onMidiPortConnected);
  //     }
  //   }
  // };

  runInit() {
    // Build the Pad components
    const padObjs = [];
    const notes = {ctrl: [], pad: []};
    PadData.forEach((data)=>{
      if (!data.type) {
        padObjs.push(null);
      } else {
        if (data.type === 'ctrl') {
          notes.ctrl.push(data.note);
          padObjs.push(new Ctrl(data));
        } else if (data.type === 'pad') {
          notes.pad.push(data.note);
          padObjs.push(new Pad(data));
        }
      }
    });
    this.pads = padObjs;
    this.padsReady = true;
    this.notes = notes;
  }
  getGridState() {
    const state = [];
    if (this.padsReady) {
      let i = 0;
      this.pads.forEach((pad)=>{
        if (pad) state.push(pad.getState());
        else state.push([i, null, null, null])
        i++;
      });
    }
    // console.log('got grid state as', state);
    return state;
  }
  resumeGridState(state) {
    state.forEach((padState)=>{
      // console.log(padState);
      if (padState && padState.length) {
        this.setPad(padState[0], {
          noteOn: padState[1],
          velocity: padState[2],
        });
      }
    });
  }

  getPad(index) {
    return this.pads[index];
  }

  setPad(index, data) {
    const pad = this.pads[index];
    // console.log(`Launchpad.setPad (${index}, data):`, data, pad, this.out, this.outputs);
    if (pad === null) {
      return;
    }
    if (data.noteOn !== null) pad.setNoteOn(data.noteOn);
    if (data.velocity !== null) pad.setVelocity(data.velocity);
    if (this.midiReady) {
      // console.log(`this.out.playNote(['${pad.getNote()}'], 'all', {velocity: ${data.velocity}, rawVelocity: true});`)
      this.out.playNote([pad.getNote()], 'all', {velocity: data.velocity, rawVelocity: true});
    }
  }

}

export default Launchpad;
