<template>
  <v-select
    v-bind="commonProps"
    :density="density"
    :variant="variant"
    :multiple="multiple"
    :chips="chips"
    :small-chips="smallChips"
    :item-title="getItemText"
    :item-value="getItemValue"
    :items="items || choices"
    @update:modelValue="update"
    :return-object="returnObject"
  >
    <template v-for="(_, scopedSlotName) in $slots" v-slot:[scopedSlotName]="slotData">
      <slot :name="scopedSlotName" v-bind="slotData" />
    </template>
    <template v-slot:no-data>
      <div>
        <v-table density="compact">
          <tbody>
            <tr>
              <td>{{ $t("va.datatable.nodata")}}</td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </template>
  </v-select>
</template>

<script>
import Input from "../../../mixins/input";
import Multiple from "../../../mixins/multiple";
import ReferenceInput from "../../../mixins/reference-input";

/**
 * Value editing from a fixed choices. Support multiple and references.
 * If no choices, by default, takes localized enums with source as value from your VueI18n resources locales.
 */
export default {
  mixins: [Input, Multiple, ReferenceInput],
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
    /**
     * Whether to return object
     */
    returnObject: {
      type: Boolean,
      default: true,
    }
  },
  async created() {
    this.items = await this.fetchChoices();
  },
};
</script>
