<script>
import ColorPalette from './ColorPalette.vue';
import PadGrid from './PadGrid.vue';
import Launchpad from '../classes/Launchpad.js';
import {colors, colorOff} from '../data/colors.js';
import {indexOff} from '../data/constants.js';
import * as grid from '../helpers/grid.js';

export default {
  data() {
    return {
      // The global launchpad object.
      launchpad: new Launchpad({}), // + midi functionality
      launchpadReady: false, // window.emit(launchpad-ready)
      
      // Colors / Palette Data
      previewColor: colorOff,
      currentColor: colorOff,
      currentColorIndex: indexOff,
      paletteOpen: false,
      paletteOnLp: true, // whether the palette displays on the launchpad
      paletteTopRow: 0,

      // Pads / Grid State
      gridState: grid.getInitialState(), // current grid state
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
      window.addEventListener('launchpad-ready', function(){
        this.launchpadReady = true;
      }, false);
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
        const pads = grid.getPaletteState(topRow);

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
        const newPaletteState = grid.getPaletteState(newRow);
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
        :connected="launchpadReady"
        @click-pad="handlePadClick"
      )
</template>
<style lang="scss">
.colorPreview {
  height: 64px;
  width: 64px;
}
</style>
