<template>
  <va-vue-currency-component 
    :density="density"
    v-bind="commonProps"
    :options="options"
    :variant="variant"
    @update:modelValue="update">
  </va-vue-currency-component>
</template>

<script>
import Input from "../../../mixins/input";

export default {
  mixins: [Input],
  props: {
    /**
     * Currency options
     */
    options: Object,
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
