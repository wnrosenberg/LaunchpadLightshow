<script>
import ColorPalette from './ColorPalette.vue';
import PadGrid from './PadGrid.vue';
import Launchpad from '../classes/Launchpad.js';
import {colors, colorOff} from '../data/colors.js';
import {indexOff} from '../data/constants.js';

export default {
  data() {
    return {
      // The global launchpad object.
      launchpad: new Launchpad({}), // + midi functionality
      
      // Colors / Palette Data
      previewColor: colorOff,
      currentColor: colorOff,
      currentColorIndex: indexOff,
      paletteOpen: false,
      paletteOnLp: true, // whether the palette displays on the launchpad
      paletteTopRow: 0,

      // Pads / Grid State
      gridState: this.getInitialState(), // current grid state
      stateBeforeModal: null,
    };
  },
  components: {
    PadGrid, // emits click-pad, which is passed to launchpad.
    ColorPalette
  },
  props: {},
  methods: {
    created: function() {
      this.gridState = this.launchpad.getGridState();
    },
    setColorPreview: function(colorIndex) {
      this.previewColor = colors[colorIndex];
    },
    setCurrentColor: function(colorIndex) {
      this.currentColor = colors[colorIndex];
      this.currentColorIndex = colorIndex;
      this.toggleColorPalette();
    },
    toggleColorPalette: function(state) {
      console.log('toggleColorPalette called');
      if (state !== undefined) {
        this.paletteOpen = state;
      } else {
        this.paletteOpen = !this.paletteOpen;
      }

      // If the palette is now open...
      if (this.paletteOpen) {
        // Backup the current grid state.
        if (!this.stateBeforeModal) this.stateBeforeModal = this.launchpad.getGridState();

        // Uninitialized palette starts at row 0;
        let topRow = 0;
        const pads = this.getPaletteState(topRow);

        // Send to the launchpad (@todo if paletteOnLp)
        this.launchpad.resumeGridState(pads);

        // And update onscreen pads.
        this.gridState = pads;

      } else {
        // Restore the previous state.
        if (this.stateBeforeModal && this.stateBeforeModal.length) {
          // Send to the launchpad (@todo if paletteOnLp)
          this.launchpad.resumeGridState(this.stateBeforeModal);

          // And update the onscreen pads.
          this.gridState = [...this.stateBeforeModal];

          // Then reset the backed up state.
          this.stateBeforeModal = null;
        }
      }

      // console.log('paletteOpen is ', this.paletteOpen);
      // console.log('this.stateBeforeModal is ', this.stateBeforeModal);
    },
    handlePadClick: function(index, data) {
      if (!this.paletteOpen) {
        if (!this.gridState[index][1]) {
          data.noteOn = true;
        }
        this.launchpad.setPad(index, data);
        this.gridState = this.launchpad.getGridState();
      } else {
        console.log('pad btn clicked while palette was open.');
        // determine which color was clicked
        // send color to setCurrentColor
        // close the palette
      }
    },
    getInitialState: function() {
      const pads = [];
      const max = 10;
      for (let i=0; i<max; i++) {
        for (let j=0; j<max; j++) {
          let index = i*max+j;
          if (i === 0 || i === (max-1) || j === 0 || j === (max-1)) {
            if (i === 0 && j === 0 || i === (max-1) && j === 0 || i === 0 && j === (max-1) || i === (max-1) && j === (max-1)) {
              pads.push([index, null, null, null]);
            } else pads.push([index, true, 0, 'ctrl']);
          } else pads.push([index, true, 0, 'note']);
        }
      }
      return pads;
    },
    getPaletteState: function(topRow) {
      const pads = [];
      const max = 10;
      let colorIndex = topRow * 8;
      for (let i=0; i<max; i++) {
        for (let j=0; j<max; j++) {
          let index = i*max+j;
          if (i === 0 || i === (max-1) || j === 0 || j === (max-1)) {
            if (i === 0 && j === 0 || i === (max-1) && j === 0 || i === 0 && j === (max-1) || i === (max-1) && j === (max-1)) {
              pads.push([index, null, null, null]);
            } else {
              pads.push([index, null, null, 'ctrl']);
            }
          } else {
            pads.push([index, true, colorIndex++, 'note']);
          }
        }
      }
      return pads;
    },
    handlePaletteCtrlDown: function() {
      console.log('clicked the DOWN control');
      console.log('topRow before click was', this.paletteTopRow);
    },
    handlePaletteCtrlUp: function() {
      console.log('clicked the UP control');
      console.log('topRow before click was', this.paletteTopRow);
    },
    handlePaletteTopRowChange: function(newRow) {
      this.paletteTopRow = newRow;
      if (this.paletteOpen && this.paletteOnLp) {
        const newPaletteState = this.getPaletteState(newRow);
        this.launchpad.resumeGridState(newPaletteState);
        this.gridState = [...newPaletteState];
      }
    }
  },
  computed: {},
};
</script>
<template lang="pug">
  .desktop
    .div
      .colorPreview(
        @click="toggleColorPalette"
        :style="{backgroundColor: previewColor}"
      )
      color-palette(
        v-show="paletteOpen"
        @hover-color="setColorPreview"
        @choose-color="setCurrentColor"
        :current-color="currentColor"
        @click-ctrl-down="handlePaletteCtrlDown"
        @click-ctrl-up="handlePaletteCtrlUp"
        @new-grid-top="handlePaletteTopRowChange"
      )
    .launchpad
      pad-grid(
        :current-color-index="currentColorIndex"
        :grid-state="gridState"
        :lp="launchpad"
        @click-pad="handlePadClick"
      )
</template>
<style lang="scss">
.colorPreview {
  height: 64px;
  width: 64px;
}
</style>
