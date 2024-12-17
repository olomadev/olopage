<template>
  <v-text-field
    :density="density"
    v-bind="commonProps"
    :variant="variant"
    type="number"
    :step="step"
    :min="min"
    :max="max"
    @change="change"
    @update:modelValue="update"
  >
    <template v-for="(_, scopedSlotName) in $slots" v-slot:[scopedSlotName]="slotData">
      <slot :name="scopedSlotName" v-bind="slotData" />
    </template>
  </v-text-field>
</template>

<script>
import Input from "../../../mixins/input";

/**
 * Optimized for number editing. Just a type number input with step, min and max attribute behavior.
 */
export default {
  mixins: [Input],
  props: {
    /**
     * Number to be edited.
     * @model
     */
    value: {
      type: [Number, String],
      default: null,
    },
    /**
     * Use different styles: 
     * 
     * | 'outlined' | 'plain' | 'underlined' | 'filled' | 'solo' | 'solo-inverted' | 'solo-filled'
     */
    variant: {
      type: String,
      default: "outlined",
    },
    /**
     * The interval step.
     */
    step: {
      type: [Number, String],
      default: 1,
    },
    /**
     * The minimum accepted value.
     */
    min: [Number, String],
    /**
     * The maximum accepted value.
     */
    max: [Number, String],
    /**
     * Name of number format to use. Must be predefined on your VueI18n plugin.
     */
    // format: {
    //   type: String,
    //   default() {
    //     return null;
    //   },
    // },
  },
  methods: {
    // numberFormatted() {
    //   if (this.input) {
    //     return this.$n(this.input, this.format);
    //   }
    // },
  }
};
</script>
