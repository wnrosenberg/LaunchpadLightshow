<script>
import ColorPalette from './ColorPalette.vue';
import Launchpad from '../classes/Launchpad.js';
export default {
  data() {
  	return {
  		// app-lvl data
  		previewColor: '#616161', // off,
  		currentColor: '#616161',

  		paletteOpen: false,
  	};
  },
  components: {
  	ColorPalette
  },
  props: {},
  methods: {
  	setColorPreview: function(color) {
  		this.previewColor = color;
  	},
  	setCurrentColor: function(color) {
  		this.currentColor = color;
  		this.toggleColorPalette();
  	},
  	toggleColorPalette: function(state) {
  		if (state !== undefined) {
  			this.paletteOpen = state;
  		} else {
  			this.paletteOpen = !this.paletteOpen;
  		}
  	}
  },
  computed: {},
};
</script>
<template lang="pug">
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
		)
</template>
<style lang="scss">
.colorPreview {
	height: 64px;
	width: 64px;
}
</style>
