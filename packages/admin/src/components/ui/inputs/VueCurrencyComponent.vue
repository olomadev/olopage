<template>
  <v-text-field
    :density="density"
    :variant="variant"
    :modelValue="formattedValue"
    ref="inputRef" 
  ></v-text-field>
</template>

<script>
import { useCurrencyInput } from 'vue-currency-input'
import { watch } from 'vue';

export default {
  props: {
    /**
     * Text to be edited.
     * @model
     */
    modelValue: {
      default: "",
    },
    /**
     * Density
     */
    density: String,
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
     * Currency options
     */
    options: Object,
  },
  setup (props) {
    const {
      inputRef,
      formattedValue
    } = useCurrencyInput(props.options)
    // 
    // ! Warning:  don't uncomment here ...
    // 
    // this side managed from form state handler within va-form component
    // 
    // watch(() => props.modelValue, (value) => {
    //   setValue(value)
    // })
    return { inputRef, formattedValue }
  }
};
</script>
