<script>
import ColorPalette from './ColorPalette.vue';
export default {
  data() {
  	return {
  		// app-lvl data
  		previewColor: '#616161', // off,
  		currentColor: '#616161'
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
  	}
  },
  computed: {},
};
</script>
<template lang="pug">
	.div
		.colorPreview(
			:style="{backgroundColor: previewColor}"
		)
		color-palette(
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