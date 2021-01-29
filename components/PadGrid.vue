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
    },
    connected: {
      type: Boolean,
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
      if (item[1] === null) {
        return '#333';
      }
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
  .padGridWrapper
    .padGrid
      //- item = [0:index, 1:noteOn, 2:velocity, 3:type]
      .padGridBtn(
        v-for="item in gridState"
        v-bind:class="{'padCtrl': item[3] === 'ctrl', 'padNote': item[3] === 'note', 'padNull': item[3] === null}"
        :data-index="item[0]"
        :data-label="lp.getPad(item[0])"
        @click="clickPad(item[0])"
        :style="{backgroundColor: getPadColor(item) }"
      )
    .padGridIndicator
      .indicator
</template>
<style lang="scss">
  $btnSize: 2rem;
  $padBorder: 1px;

  .padGridWrapper {
    background: #333;
    margin-left: 230px;
    width: calc( 10 * ( #{$btnSize + ($btnSize / 5)} + #{2 * $padBorder}) );
    padding: 10px 10px 0px 10px;
  }

  .padGrid {
    display: flex;
    flex-flow: row wrap;
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
      width: 4 * $btnSize / 5;
      height: 4 * $btnSize / 5;
      margin: 2 * $btnSize / 10;
    }
    &.padNote {
      border-radius: 3px;
    }
    &.padNull {
      visibility: hidden;
    }
    &:nth-child(1) {
      border-radius: 50%;
      width: 2 * $btnSize / 5;
      height: 2 * $btnSize / 5;
      margin: 2 * $btnSize / 5;
      visibility: visible;
      &::after {
        display: none;
      }
    }
    &:nth-child(45){
      border-radius: 3px 3px 8px 3px;
    }
    &:nth-child(46){
      border-radius: 3px 3px 3px 8px;
    }
    &:nth-child(55){
      border-radius: 3px 8px 3px 3px;
    }
    &:nth-child(56){
      border-radius: 8px 3px 3px 3px;
    }
  }
  .padGridIndicator {
    width: 100%;
    height: 5px;
    .indicator {
      width: 10px;
      height: 5px;
      margin: 0px auto;
      background: #8a8a8a;
      &.connected {
        background: #FFB361;
      }
    }
  }
</style>
