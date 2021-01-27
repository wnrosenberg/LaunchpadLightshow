<script>
/**
 * PadGrid.js
 *
 * PadGrid is responsible for handling onscreen user interaction.
 */
import Launchpad from '../classes/Launchpad.js';
import {colors, colorOff} from '../data/colors.js';
export default {
  data() {
    return {};
  },
  props: {
    lp: {
      type: Object,
      required: true,
    },
    gridState: {
      type: Array,
      required: true,
    },
    currentColorIndex: {
      type: Number,
      required: true
    }
  },
  computed: {
    currentColor: function() {
      return colors[this.currentColorIndex];
    }
  },
  methods: {
    clickPad: function(index) {
      this.$emit('click-pad', index, {
        velocity: this.currentColorIndex
      });
    },
    getPadColor: function(item) {
      // item = [0:index, 1:noteOn, 2:velocity, 3:type]
      if (item[1] === true && item[2] !== null) {
        return colors[item[2]];
      } else {
        return colorOff;
      }
    }
  }
};
</script>
<template lang="pug">
  .padGrid
    //- item = [0:index, 1:noteOn, 2:velocity, 3:type]
    .padGridBtn(
      v-for="item in gridState"
      v-bind:class="{'padCtrl': item[3] === 'ctrl', 'padNote': item[3] === 'note', 'padNull': item[3] === null}"
      :data-index="item[0]"
      @click="clickPad(item[0])"
      :style="{backgroundColor: getPadColor(item) }"
    )
</template>
<style lang="scss">
  $btnSize: 2rem;
  $padBorder: 1px;

  .padGrid {
    margin-left: 230px;
    display: flex;
    flex-flow: row wrap;
    padding: 0;
    width: calc( 10 * ( #{$btnSize + ($btnSize / 5)} + #{2 * $padBorder}) );
    background: #ccc;
  }

  .padGridBtn {
    width: $btnSize;
    height: $btnSize;
    border: $padBorder solid #000;
    margin: $btnSize / 10;
    padding: 0;
    cursor: pointer;
    font-size: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    &::after {
      content: attr(data-index);
    }
    &.off::after {
      content: 'OFF';
    }
    &.padCtrl {
      border-radius: 50%;
    }
    &.padNote {
      border-radius: 3px;
    }
    &.padNull {
      visibility: hidden;
    }
  }
</style>
