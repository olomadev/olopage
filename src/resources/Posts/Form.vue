<template>
  <va-form 
    :id="id" 
    :item="item" 
    v-model="model"
  >
    <v-row no-gutters>
      <v-col cols="12" lg="8">
        <va-text-input
          source="title"
          :error-messages="titleErrors"
          variant="outlined"
        ></va-text-input>

<!--         <va-text-input
          source="permalink"
          :error-messages="permalinkErrors"
          variant="outlined"
        ></va-text-input> -->
      </v-col>
    </v-row>
    <va-save-button></va-save-button>
  </va-form>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { required, maxLength, numeric } from "@vuelidate/validators";
import utils from "olobase-admin/src/mixins/utils";
import { provide } from 'vue'

export default {
  props: ["id", "item"],
  mixins: [utils],
  setup() {
    let vuelidate = useVuelidate();
    provide('v$', vuelidate)
    return { v$: vuelidate }
  },
  data() {
    return {
      model: {
        id: null,
        title: null,
        permalink: null,
        categories: null,
        tags: null,
      },
      // fields: [
      //   { source: "moduleName" },
      //   { source: "action" },
      //   { source: "route" },
      //   { source: "method"},
      // ],
    };
  },
  validations() {
    return {
      model: {
        title: {
          required,
          maxLength: maxLength(220),
        },
      },
    }
  },
  computed: {
    // headers() {
    //   return [
    //     {
    //       key: "moduleName",
    //       sortable: false,
    //     },
    //     {
    //       key: "action",
    //       sortable: false,
    //     },
    //     {
    //       key: "route",
    //       sortable: false,
    //     },
    //     {
    //       key: "method",
    //       sortable: false,
    //     },
    //   ];
    // },
    titleErrors() {
      const errors = [];
      const field = "title";
      if (!this.v$["model"][field].$dirty) return errors;
      this.v$["model"][field].required.$invalid &&
        errors.push(this.$t("v.text.required"));
      this.v$["model"][field].maxLength.$invalid &&
        errors.push(this.$t("v.string.maxLength", { max: "220" }));
      return errors;
    },
  },
  created() {
    this.model.id = this.generateId(this);
  }
}
</script>
