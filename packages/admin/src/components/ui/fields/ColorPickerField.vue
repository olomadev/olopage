<template>
  <div :style="getSwatchStyle"></div>
</template>

<script>
import Field from "../../../mixins/field";
/**
 * Show value as simple text, render a simple span. HTML tags will be stripped.
 */
export default {
  mixins: [Field],
  props: {
    width: {
      type: String,
      default() {
        return  "20px";
      },
    },
    height: {
      type: String,
      default() {
        return  "20px";
      },
    },
  },
  computed: {
    getSwatchStyle(color) {
      return {
        marginRight: "10px",
        backgroundColor: this.value,
        height: this.height,
        width: this.width,
        border:"1px solid #dddddd",
        borderRadius: '50%',
        transition: 'border-radius 200ms ease-in-out'
      }
    },
  },
};
</script>
