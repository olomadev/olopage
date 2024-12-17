<template>
  <va-input v-bind="$props">
    <v-rating
      :density="density"
      v-bind="commonProps"
      :activeColor="activeColor"
      :clearable="clearable"
      :color="color"
      :disabled="disabled"
      :empty-icon="emptyIcon"
      :full-icon="fullIcon"
      :half-increments="halfIncrements"
      :hover="hover"
      :item-aria-label="itemAriaLabel"
      :item-labels="itemLabels"
      :length="length"
      :name="name"
      :readonly="readonly"
      :size="size"
      @change="change"
      @update:modelValue="update"
    >
      <template v-for="(_, scopedSlotName) in $slots" v-slot:[scopedSlotName]="slotData">
        <slot :name="scopedSlotName" v-bind="slotData" />
      </template>
    </v-rating>
  </va-input>
</template>

<script>
import Input from "../../../mixins/input";
import Rating from "../../../mixins/rating";

/**
 * Edit number value as rating stars. Value should be a valid integer or decimal if half increments enabled.
 * Icons can be edited via $ratingFull, $ratingEmpty and $ratingHalf on Vuetify settings.
 */
export default {
  mixins: [Input, Rating],
  props: {
    /**
     * Number to be edited.
     * @model
     */
    value: {
      type: Number,
      default: null,
    },
    /**
     * Type of text input. All HTML type allowed.
     */
    type: {
      type: String,
      default: "number",
    },
  },
};
</script>
