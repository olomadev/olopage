<template>
  <v-radio-group
    :density="density"
    :inline="inline"
    v-bind="commonProps"
    @update:modelValue="update"
  >
    <template v-for="(_, scopedSlotName) in $slots" v-slot:[scopedSlotName]="slotData">
      <slot :name="scopedSlotName" v-bind="slotData" />
    </template>
    <v-radio v-if="clearable" value="none" class="mr-2" :label="$t('va.forms.none')"></v-radio>
    <v-radio
      class="mr-2"
      v-for="(c, i) in items || choices"
      :key="i"
      :label="c[getItemText]"
      :value="c[getItemValue]"
    ></v-radio>
  </v-radio-group>
</template>

<script>
import Input from "../../../mixins/input";
import ReferenceInput from "../../../mixins/reference-input";

/**
 * Value editing from a fixed choices. Support references.
 * If no choices, by default, takes localized enums with source as value from your VueI18n resources locales.
 */
export default {
  mixins: [Input, ReferenceInput],
  props: {
    /**
     * Show radios as a row.
     */
    inline: Boolean,
  },
  async created() {
    this.items = await this.fetchChoices();
  },
};
</script>
