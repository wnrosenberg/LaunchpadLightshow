<script>
export default {
  data() {
    return {
      colors: [
        '#616161', // 0/off
        '#B3B3B3',
        '#DDDDDD',
        '#FFFFFF',
        '#FFB3B3',
        '#FF6161',
        '#DD6161',
        '#B36161',
        
        '#FFF3D5', // 8
        '#FFB361',
        '#DD8C61',
        '#B37661',
        '#FFEEA1',
        '#FFFF61',
        '#DDDD61',
        '#B3B361',
        
        '#DDFFA1',// 16
        '#C2FF61',
        '#A1DD61',
        '#81B361',
        '#C2FFB3',
        '#61FF61',
        '#52D752',
        '#61B361',
        
        '#C2FFC2', // 24
        '#61FF8C',
        '#61DD76',
        '#61B36B',
        '#C2FFCC',
        '#61FFCC',
        '#61DDA1',
        '#61B381',
        
        '#C2FFF3', // 32
        '#61FFE9',
        '#61DDC2',
        '#61B396',
        '#C2F3FF',
        '#61E9FF',
        '#61C7DD',
        '#61A1B3',
        
        '#CCE4FF', // 40
        '#61C7FF',
        '#61A1DD',
        '#6181B3',
        '#A18CFF',
        '#6161FF',
        '#6161DD',
        '#6161B3',
        
        '#B39DE0', // 48
        '#A161FF',
        '#8161DD',
        '#7661B3',
        '#FFB3FF',
        '#E958E9',
        '#DD61DD',
        '#B361B3',
        
        '#FFB3D5', // 56
        '#FF61C2',
        '#DD61A1',
        '#B3618C',
        '#FD7560',
        '#E9B361',
        '#DDC261',
        '#8D8D56',
        
        '#61B361', // 64
        '#2C5240',
        '#618CD5',
        '#6161FF',
        '#61B3B3',
        '#8C61F3',
        '#CCB3C2',
        '#8C7681',
        
        '#FF6161', // 72
        '#F3FFA1',
        '#EEFC61',
        '#BFFB60',
        '#75DC60',
        '#5FFAC8',
        '#61E8FE',
        '#61A1FF',
        
        '#A161FF', // 80
        '#CC61FC',
        '#F18EE0',
        '#A17661',
        '#FFA161',
        '#EEFC61',
        '#D5FF8C',
        '#5CF15C',
        
        '#B3FFA1', // 88
        '#CCFCD5',
        '#C2FFF3',
        '#CFE7FF',
        '#A1C2F6',
        '#D5C2F9',
        '#F98CFF',
        '#FF61CC',
        
        '#FFC261', // 96
        '#AEAA45',
        '#EEFC61',
        '#DDCC61',
        '#B3A161',
        '#61B36B',
        '#74BF8B',
        '#8181A1',
        
        '#818CCC', // 104
        '#B49672',
        '#DD6161',
        '#F9B3A1',
        '#F9BA76',
        '#FFF68E',
        '#F3FFA1',
        '#D5EE76',
        
        '#8181A1', // 112
        '#FFF3D5',
        '#DDFCE4',
        '#E9E9FF',
        '#E4D5FF',
        '#B3B3B3',
        '#DDDDDD',
        '#FFFFFF',
        
        '#DD6161', // 120
        '#B36161',
        '#81F661',
        '#61B361',
        '#F3EE61',
        '#B3A161',
        '#EEC261',
        '#B37661',
      ],
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
  /*
  emits: {
    'choose-color': (index) => {} // user chooses color
    'hover-color': (index) => {} // user hovers over color
  },
  */
  methods: {
    chooseColor(colorIndex) {
      this.$emit('choose-color', this.colors[colorIndex]);
      this.chosenColor = colorIndex;
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
      this.$emit('hover-color', this.colors[colorIndex]);
    },
    moveGridUp() {
      if (this.gridTopRow > 0) this.gridTopRow--;
    },
    moveGridDown() {
      if (this.gridTopRow < 8) this.gridTopRow++;
    }
  },
  computed: {
    gridTop: function(){
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
