// class Launchpad
import WebMidi from 'webmidi';
import PadButton from './PadButton';
import PadData from '../data/pads.js';

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

    // State
    this.notes = {ctrl: [], pad: []};
    this.pads = [];
    this.padsReady = false;
    this.midiEnabled = false;
    this.midiReady = false;
    this.inputs = []; // list of MIDI ins
    this.outputs = []; // list of MIDI outs
    this.in = null; // primary input, or null to listen on all
    this.out = null; // primary out we are sending to

    // Methods
    this.runInit = this.runInit.bind(this);
    this.onWebMidiEnabled =  this.onWebMidiEnabled.bind(this);
    this.onMidiPortConnected = this.onMidiPortConnected.bind(this);
    this.onMidiReady = this.onMidiReady.bind(this);
    this.setPad = this.setPad.bind(this);

    // navigator.requestMIDIAccess({sysex:false})
    //   .then(function(access) {
    //     //this.runInit();
    //     // console.log("it has some pads: ", this.pads);
    //     console.log(access);
    //   });
    this.runInit();
  }

  onMidiReady() {
    console.log('onMidiReady callback started');
    // Reset all pads to OFF
    // allPadsOff();
    // console.log('out', this.out);
    // this.out.playNote(['C4','C5','C6'], 'all', {velocity: 120, rawVelocity: true});

    // @todo If there's a saved state, restore that and display message about restored state.

    // @Todo highlight the control pads
  }

  onMidiPortConnected(event) {
    // Launchpad has 6 ports.
    if (event.port.type === 'input') {
      this.inputs.push(event.port);
    }
    if (event.port.type === 'output') {
      this.outputs.push(event.port);
      // primary out is probably first detected
      // @todo its usually port 1
      if (event.port.id === 'output-2') {
        this.out = event.port;
      }
    }
    // If all are connected, we are ready to go.
    if (this.inputs.length + this.outputs.length === 6) {
      this.midiReady = true;
      console.log('LAUNCHPAD READY');
      this.onMidiReady();
    }
  };
  onWebMidiEnabled(err) {
    if (err) {
      console.error("WebMidi could not be enabled, continuing with standard experience.", err);
    } else {
      this.midiEnabled = true;
      if (WebMidi.inputs.length + WebMidi.outputs.length === 6) {
        console.log('ports already connected');
        // ports already connected.
        this.inputs = [...WebMidi.inputs];
        this.outputs = [...WebMidi.outputs];
        this.out = WebMidi.outputs[1];
        this.midiReady = true;
        console.log('LAUNCHPAD READY');
        this.onMidiReady();
      } else {
        WebMidi.addListener("connected", this.onMidiPortConnected);
      }
    }
  };

  runInit() {
    // Setup the MIDI Interface
    WebMidi.enable(this.onWebMidiEnabled);

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
