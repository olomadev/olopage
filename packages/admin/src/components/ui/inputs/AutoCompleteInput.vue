<template>
  <component
    :is="taggable ? 'v-combobox' : 'v-autocomplete'"
    :density="density"
    v-bind="commonProps"
    :variant="variant"
    :multiple="multiple"
    :chips="chips"
    closable-chips
    :loading="loading"
    :item-title="getItemText"
    :item-value="getItemValue"
    :items="items || choices"
    v-on:keyup="asyncSearch($event)"
    @update:modelValue="update"
    :clearable="clearable"
    return-object
  >
    <template v-for="(_, scopedSlotName) in $slots" v-slot:[scopedSlotName]="slotData">
      <slot :name="scopedSlotName" v-bind="slotData" />
    </template>
  </component>
</template>
<!-- https://blog.devgenius.io/vuetify-customize-autocomplete-c298033784d2 -->
<!-- https://codepen.io/cenozoic/pen/xxbBOYj -->
<script>
import Input from "../../../mixins/input";
import Multiple from "../../../mixins/multiple";
import ReferenceInput from "../../../mixins/reference-input";

/**
 * Value editing from a searchable choices. Support multiple and references.
 * Allows searching of linked resources from your API.
 */
export default {
  mixins: [Input, Multiple, ReferenceInput],
  props: {
    /**
     * Minimum characters to tap before search query launch.
     */
    minChars: {
      type: Number,
      default: 3,
    },
    /**
     * Name of request query for searching into your API.
     */
    searchQuery: {
      type: String,
      default: "q",
    },
    /**
     * Enable taggable mode. Transform autocomplete into combobox.
     */
    taggable: Boolean,
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
      search: null
    };
  },
  methods: {
    async loadCurrentChoices(value) {
      if (this.reference && value) {
        this.items = await this.fetchCurrentChoices(
          this.multiple ? value : [value]
        );
      }
    },
    async asyncSearch(e) {
      this.search = e.target.value;
    }
  },
  watch: {
    input: {
      handler(newVal) {
        /**
         * Fetch full object as soon as we get input value
         */
        this.loadCurrentChoices(newVal);
      },
      immediate: true,
    },
    async search(val, old) {
      if (old === null) {
        return;
      }
      if (!val || val.length < this.minChars) {
        return;
      }
      this.items = [
        // ...(this.items || []), // don't repeat same values
        ...((await this.fetchChoices(val)) || []),
      ];
    },

  },
};
</script>
