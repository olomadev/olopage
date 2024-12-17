<template>
  <v-textarea
    v-if="multiline"
    :density="density"
    v-bind="commonProps"
    color="primary"
    auto-grow
    :variant="variant"
    @change="change"
    @update:modelValue="update"
  >
    <template v-for="(_, scopedSlotName) in $slots" v-slot:[scopedSlotName]="slotData">
      <slot v-if="scopedSlotName" :name="scopedSlotName" v-bind="slotData" />
    </template>
  </v-textarea>
  <v-text-field
    v-else
    :density="density"
    v-bind="commonProps"
    :type="type"
    color="primary"
    :variant="variant"
    @change="change"
    @update:modelValue="update"
  >
    <template v-for="(_, scopedSlotName) in $slots" v-slot:[scopedSlotName]="slotData">
      <slot v-if="scopedSlotName" :name="scopedSlotName" v-bind="slotData" />
    </template>
  </v-text-field>
</template>

<script>
import Input from "../../../mixins/input"

/**
 * Text editing for text value type via a basic text input.
 * Support textarea mode for long text via `multiline` prop.
 * Can be use for any date, datetime or time editing, use type set on `date`, `datetime-local` or `time`.
 * Render will depend of browser support.
 */
export default {
  mixins: [Input],
  props: {
    /**
     * Type of text input. All HTML type allowed.
     */
    type: {
      type: [String, Number],
      default: "text",
    },
    /**
     * Transform text input into textarea.
     */
    multiline: Boolean,
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
};
</script>
