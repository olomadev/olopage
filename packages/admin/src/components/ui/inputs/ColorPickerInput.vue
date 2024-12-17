<template>
  <v-text-field 
    :variant="variant"
    readonly 
    :density="density"
    v-bind="commonProps" 
    @change="changeState"
    >
    <template v-for="(_, scopedSlotName) in $slots" v-slot:[scopedSlotName]="slotData">
      <slot :name="scopedSlotName" v-bind="slotData" />
    </template>
    <template v-slot:append-inner>
      <v-menu 
        v-model="menu" 
        top 
        nudge-bottom="105" 
        nudge-left="16" 
        :close-on-content-click="false"
        >
        <template v-slot:activator="{ props }">
          <div :style="swatchStyle" v-bind="props" />
        </template>
        <v-card>
          <v-card-text class="pa-0">
            <v-color-picker
              :border="border"
              :color="color"
              :dot-size="dotSize"
              :hide-canvas="hideCanvas"
              :canvas-height="canvasHeight"
              :mode="mode"
              :modes="modes"
              :hide-inputs="hideInputs"
              :hide-sliders="hideSliders"
              :rounded="rounded"
              :show-swatches="showSwatches"
              :swatches="swatches"
              :swatches-max-height="swatchesMaxHeight"
              :position="position"
              :width="width"
              :variant="variant"
              :value="input"
              @update:modelValue="updateColor"
            ></v-color-picker> 
          </v-card-text>
        </v-card>
        <v-btn
          @click="close"
          >
          {{ $t("va.actions.close") }}
        </v-btn>
      </v-menu>
    </template>
  </v-text-field>
</template>

<script>
import Input from "../../../mixins/input";
/**
 * Edit value as boolean. Rendered as a switch.
 */
export default {
  mixins: [Input],
  props: {
    /**
     * Text to be edited.
     */
    value: {
      type: String,
      default: "#FFFFFF",
    },
    /**
     * Applies border styles to component
     */
    border: [String, Number, Boolean],
    /**
     * Designates the border-radius applied to the component
     */
    rounded: [String, Number, Boolean],
    // 
    // this prop already defined no need to declare again
    // 
    // color: String,
    /**
     * Changes the size of the selection dot on the canvas.
     */
    dotSize: String,
    /**
     * Hides canvas
     */
    hideCanvas: Boolean,
    /**
     * Height of canvas
     */
    canvasHeight: [String, Number],
    /**
     * The current selected input type. Syncable with v-model:mode.
     * 'rgb' | 'rgba' | 'hsl' | 'hsla' | 'hex' | 'hexa'
     */
    mode: String,
    /**
     * Sets available input types.
     */
    modes: Array,
    /**
     * Hides inputs
     */
    hideInputs: Boolean,
    /**
     * Hides sliders
     */
    hideSliders: Boolean,
    /**
     * Displays color swatches
     */
    showSwatches: Boolean,
    /**
     * Sets the available color swatches to select from. 2D array of rows and columns, accepts any color format the picker does
     */
    swatches: Array,
    /**
     * Sets the maximum height of the swatches section
     */
    swatchesMaxHeight: [String, Number],
    /**
     * Sets the position for the component
     * 'static' | 'relative' | 'fixed' | 'absolute' | 'sticky
     */
    position: String,
    /**
     * Sets the width of the color picker
     */
    width: String,
    /**
     * Use different styles: 
     * 
     * | 'outlined' | 'plain' | 'underlined' | 'filled' | 'solo' | 'solo-inverted' | 'solo-filled'
     */
    variant: {
      type: String,
      default: "outlined",
    },
  },
  data() {
     return {
        menu: false,
        color: null,
        type: "text",
     }
  },
  mounted() {
    if (! this.input) {
      this.input = '#FFFFFF'
    }
  },
  methods: {
    close() {
      this.menu = false
    },
    changeState(value) {
      this.change(value);
      this.update(value);
    },
    updateColor(val) {
      this.update(val);
    }
  },
  computed: {
    swatchStyle() {
      return {
        backgroundColor: this.input,
        cursor: 'pointer',
        height: '25px',
        width: '25px',
        border:"1px solid #dddddd",
        borderRadius: '50%',
        transition: 'border-radius 200ms ease-in-out'
      }
    },
  }
};
</script>
