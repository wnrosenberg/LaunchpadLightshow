<script>
import {colors} from '../data/colors.js';

export default {
  data() {
    return {
      colors: colors,
      gridTopRow: 0,
      chosenColor: this.currentColor,
    };
  },
  props: {
    currentColor: {
      type: String,
      required: true
    }
  },
  methods: {
    chooseColor(colorIndex) {
      // Emit and set local state.
      this.$emit('choose-color', colorIndex);
      this.chosenColor = colorIndex;
      
      // Adjust the grid boundary to include chosen color
      const colorRow = Math.floor(colorIndex / 8);
      if (colorRow < this.gridTopRow) {
        while(colorRow < this.gridTopRow) {
          this.gridTopRow--;
        }
      } else if (colorRow > this.gridTopRow + 7) {
        while(colorRow > this.gridTopRow + 7) {
          this.gridTopRow++;
        }  
      }
    },
    hoverColor(colorIndex) {
      this.$emit('hover-color', colorIndex);
    },
    moveGridUp() {
      this.$emit('click-ctrl-up');
      if (this.gridTopRow > 0) this.gridTopRow--;
    },
    moveGridDown() {
      this.$emit('click-ctrl-down');
      if (this.gridTopRow < 8) this.gridTopRow++;
    }
  },
  computed: {
    gridTop: function(){
      this.$emit('new-grid-top', this.gridTopRow);
      return (this.gridTopRow * 20 * 1.25) + 'px';
    },
  },
};
</script>
<template lang="pug">
  #palette
    .palette-controls
      .control.ctrl-up(
        @click="moveGridUp()"
        v-bind:class="{disabled: gridTopRow === 0}"
        data-index="UP"
      )
      .control.ctrl-down(
        @click="moveGridDown()"
        v-bind:class="{disabled: gridTopRow === 8}"
        data-index="DN"
      )
    .color-palette
      .palette-grid(:style="{top: gridTop}")
      .palette-colors
        .palette-color(
          v-for="(color, colorIndex) in colors"
          :style="{backgroundColor: color}"
          v-bind:data-index="colorIndex"
          @click="chooseColor(colorIndex)"
          v-on:mouseover="hoverColor(colorIndex)"
          v-bind:class="{active: chosenColor === colorIndex}"
        )
</template>
<style lang="scss">
  $padOff: #616161;
  $swatchSize: 20px;
  $swatchSpacing: $swatchSize/8;
  #palette {
    position: absolute;
    background: #333333;
    width: 8 * ($swatchSize + 2 * $swatchSpacing) + 4 * $swatchSpacing;
    height: 17 * ($swatchSize + 2 * $swatchSpacing) + 4 * $swatchSpacing;
    font-family: sans-serif;
    font-size: $swatchSize/2;
  }
  .palette-controls {
    padding: 2*$swatchSpacing 2*$swatchSpacing 0;
    display: flex;
    flex-flow: row;
    .control {
      margin: $swatchSpacing;
      height: $swatchSize;
      width: $swatchSize;
      border-radius: $swatchSize/2;
      background-color: #61FF61;
      font-size: 10px;
      font-family: sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      &::after {
        content: attr(data-index);
        color: #333;
        text-shadow: 1px 1px #ccc;
      }
      &.disabled {
        background-color: #61B361;
        cursor: default;
      }
    }
  }
  .color-palette {
    position: relative;
  }
  .palette-colors {
    display: flex;
    padding: 0 2*$swatchSpacing 2*$swatchSpacing;
    flex-flow: row wrap;
    width: 8 * $swatchSize + 16 * $swatchSpacing;
    position: absolute;
    top: 0;
    left: 0;
  }
  .palette-color {
    margin: $swatchSpacing;
    height: $swatchSize;
    width: $swatchSize;
    box-shadow: inset 0px 0px $swatchSpacing/2 $padOff;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    &::after {
      color: #111;
      content: attr(data-index);
      text-shadow: 1px 1px #ccc;
    }
    &:first-child::after {
      content: 'OFF';
    }
    &.active {
      box-shadow: 0px 0px $swatchSpacing $swatchSpacing #fff;
      cursor: default;
    }
  }
  .palette-grid {
    width: 8 * $swatchSize + 16 * $swatchSpacing;
    height: 8 * $swatchSize + 16 * $swatchSpacing;
    position: absolute;
    top: 0px; // set by js
    left: 2*$swatchSpacing;
    box-shadow: 0px 0px $swatchSpacing $swatchSpacing #f00;
    transition: all .4s;
  }
</style>
