<template>
  <v-chip-group 
    :column="column"
  >
    <v-chip
      v-for="(item, i) in value"
      :key="i"
      :color="getColor(value)"
      :small="small"
    >
      <slot :value="item">
        <span>{{ getItemText(item) }}</span>
      </slot>
    </v-chip>
  </v-chip-group>
</template>

<script>
import Field from "../../../mixins/field";
import Chip from "../../../mixins/chip";

/**
 * Show each single value of multiple array type value as material chip group.
 */
export default {
  mixins: [Field, Chip],
  props: {
    /**
     * Property used for stringify inner item if object.
     * Use a function for further stringify customization.
     */
    itemText: {
      type: [String, Array, Function],
      default: "name",
    },
    /**
     * Show list of chips as column.
     */
    column: Boolean,
  },
  methods: {
    getItemText(item) {
      if (typeof this.itemText === "function") {
        return this.item(item);
      }
      return item[this.itemText] || item;
    },
  },
};
</script>
