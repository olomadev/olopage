<template>
  <va-form :id="id" :item="item" v-model="model">
    <v-row no-gutters>
      <v-col lg="3" md="3" sm="8">
        <va-select-input
          source="route"
          reference="routes"
          :error-messages="routeErrors"
          multiple
          clearable
        ></va-select-input>

        <va-text-input
          source="title"
          :error-messages="titleErrors"
        ></va-text-input>

        <va-auto-complete-input 
          source="keywords"
          reference="keywords" 
          multiple 
          chips 
          taggable 
          closable-chips
          :error-messages="keywordErrors"
        >
        </va-auto-complete-input>

        <va-text-input
          source="description"
          :error-messages="descriptionErrors"
          multiline
        ></va-text-input>

        <va-boolean-input
          source="publishStatus"
          hide-details
        ></va-boolean-input>
      </v-col>
    </v-row>
    <va-save-button></va-save-button>
  </va-form>
</template>

<script>
import { provide } from 'vue';
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength, maxLength } from "@vuelidate/validators";
import Utils from "olobase-admin/src/mixins/utils";

export default {
  props: ["id", "item"],
  mixins: [Utils],
  inheritAttrs: false,
  setup() {
    let vuelidate = useVuelidate();
    provide('v$', vuelidate)
    return { v$: vuelidate }
  },
  validations: {
    model: {
      route: {
        required,
        minLength: minLength(1),
        maxLength: maxLength(60),
      },
      title: {
        required,
        minLength: minLength(2),
        maxLength: maxLength(100),
      },
      keywords: {
        required,
      },
      description: {
        required,
        minLength: minLength(30),
        maxLength: maxLength(255),
      },
    }
  },
  data() {
    return {
      model: {
        id: null,
        route: null,
        title: null,
        keywords: null,
        description: null,
        publishStatus: 0,
      },
    };
  },
  created() {
    this.model.id = this.generateId(this);
    if (!this.id) {
      this.model.password = this.generatePassword(8);
    }
  },
  computed: {
    routeErrors() {
      const errors = [];
      if (!this.v$['model'].route.$dirty) return errors;
      this.v$['model'].route.required.$invalid &&
        errors.push(this.$t("v.text.required"));
      this.v$['model'].route.minLength.$invalid &&
        errors.push(this.$t("v.string.minLength", { min: "1" }));
      this.v$['model'].route.maxLength.$invalid &&
        errors.push(this.$t("v.string.maxLength", { max: "60" }));
      return errors;
    },
    titleErrors() {
      const errors = [];
      if (!this.v$['model'].title.$dirty) return errors;
      this.v$['model'].title.required.$invalid &&
        errors.push(this.$t("v.text.required"));
      this.v$['model'].title.minLength.$invalid &&
        errors.push(this.$t("v.string.minLength", { min: "2" }));
      this.v$['model'].title.maxLength.$invalid &&
        errors.push(this.$t("v.string.maxLength", { max: "100" }));
      return errors;
    },
    keywordErrors() {
      const errors = [];
      if (!this.v$["model"].keywords.$dirty) return errors;
      this.v$["model"].keywords.required.$invalid &&
        errors.push(this.$t("v.text.required"));
      return errors;
    },
    descriptionErrors() {
      const errors = [];
      if (!this.v$["model"].description.$dirty) return errors;
      this.v$["model"].description.minLength.$invalid &&
        errors.push(this.$t("v.string.minLength", { min: "30" }));
      this.v$["model"].description.maxLength.$invalid &&
        errors.push(this.$t("v.string.maxLength", { max: "255" }));
      return errors;
    },
  },
}
</script>