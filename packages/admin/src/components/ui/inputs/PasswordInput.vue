<template>
  <v-text-field
    :density="density"
    :autocomplete="false"
    v-bind="commonProps"
    :variant="variant"
    :type="show ? 'text' : 'password'"
    :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
    @click:append-inner="show = !show"
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
 * Use it for password. No value accepted. Has show/hide behavior for current input.
 */
export default {
  mixins: [Input],
  props: {
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
      show: false,
      acceptValue: false,
    };
  },
};
</script>
