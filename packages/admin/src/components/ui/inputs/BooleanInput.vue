<template>
  <v-switch
    :false-value="0"
    :true-value="1"
    :input-value="input"
    v-bind="commonProps"
    @change="change"
    @update:modelValue="update"
  >
    <template v-for="(_, scopedSlotName) in $slots" v-slot:[scopedSlotName]="slotData">
      <slot :name="scopedSlotName" v-bind="slotData" />
    </template>
  </v-switch>
</template>

<script>
import Input from "../../../mixins/input";

/**
 * Edit value as boolean. Rendered as a switch.
 */
export default {
  mixins: [Input],
  props: {
    /**
     * Integer to be edited.
     * @model
     */
    value: null,
  },
  data() {
     return {
        type: "boolean",
     }
  },
  methods: {
    // changeState(value) {
    //   this.change(value);
    //   this.update(value);
    // },
  },
};
</script>
