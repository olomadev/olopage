<template>
  <div>
    <v-chip v-if="chip" :color="getColor(value)" :small="small" :to="to">
      <slot :value="selected">
        <span>{{ selected ? selected[itemText] : getSelectedValue }}</span>
      </slot>  
    </v-chip>
    <span v-else>
      <slot :value="selected">
        <span>{{ selected ? selected[itemText] : getSelectedValue }}</span>
      </slot>
    </span>
  </div>
</template>

<script>
import Field from "../../../mixins/field";
import Choices from "../../../mixins/choices";
import Chip from "../../../mixins/chip";
/**
 * Show value as text selected from a predefined key-value choices.
 * If no choices, by default, takes localized enums with source as value from your VueI18n resources locales.
 */
export default {
  mixins: [Field, Choices, Chip],
  props: {
    /**
     * Show text inside material chip.
     */
    chip: {
      type: Boolean,
      default() {
        return true;
      },
    },
  },
  computed: {
    getSelectedValue() {
      if (! this.value || ! Object.hasOwn(this.value, this.itemText)) {
        return ""
      }
      return this.value[this.itemText]
    },
    selected() {
      return this.choices.find((c) => c[this.itemValue] === this.value);
    },
  },
};
</script>
