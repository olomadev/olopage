import isEmpty from "lodash/isEmpty";
import Choices from "./choices";
import Search from "./search";

/**
 * For all input components that support resource reference, as `VaSelectInput`, `VaRadioGroupInput` or `VaAutocompleteInput`.
 */
export default {
  inject: [],
  mixins: [Choices, Search],
  props: {
    /**
     * Value to be selected, array if multiple.
     * @model
     */
    modelValue: {
      type: [String, Number, Array, Object],
      default: "",
    },
    /**
     * Name of resource to search into.
     */
    reference: String,
  },
  data() {
    return {
      loading: false,
      items: null,
    };
  },
  computed: {
    getItemText() {
      if (this.itemText !== "text") {
        return this.itemText;
      }
      if (this.reference) {
        let resource = this.$admin.getResource(this.reference);
        return resource.label || "label";
      }
      return this.itemText;
    },
    getItemValue() {
      if (this.itemValue !== "value") {
        return this.itemValue;
      }
      if (this.reference) {
        return "id";
      }
      return this.itemValue;
    },
    getFields() {
      if (!isEmpty(this.fields)) {
        return this.fields;
      }
      let resource = this.$admin.getResource(this.reference);
      return (
        (resource && typeof resource.autocompleteFields !== 'undefined') ||
        (typeof this.getItemText === "string"
          ? [this.getItemValue, this.getItemText]
          : [])
      );
    },
  },
  methods: {
    // getItem(value) {
    //   if (!value) {
    //     return value;
    //   }
    //   let input = this.multiple
    //     ? value.map((v) => v[this.getItemValue] || v)
    //     : value[this.getItemValue] || value;

    //   return input;
    // },
    async fetchChoices(search = null) {
      if (!this.reference) {
        return;
      }
      if (this.loading) {
        return;
      }
      this.loading = true;
      /**
       * Load paginated and sorted data list
       */
      let { data } = await this.$store.getResource(this.reference).getListAll({

        fields: {
          [this.reference]: this.getFields,
        },
        include: this.include,
        // pagination: {
        //   page: 1,
        //   perPage: this.itemsPerPage,
        // },
        sort: this.sortBy.map((by, index) => {
          return { by, desc: this.sortDesc[index] };
        }),
        filter: {
          ...this.filter,
          ...(this.searchQuery && search && { [this.searchQuery]: search }),
        },
      });
      if (data && data['error']) {
        this.$store.getModule("messages").show({ type: 'info', message: data.error });
      }
      this.loading = false;
      return data.data;
    },
    async fetchCurrentChoices(ids) {
      if (!this.reference) {
        console.error("Please provide a reference table in attributes.");
        return;
      }
      if (isEmpty(ids)) {
        return;
      }
      ids = ids.map(function(val){
        return { id: val }
      });

      this.loading = true;

      /**
       * Fetch related item records
       * Used for preloaded autocomplete inputs
       */
      let { data } = await this.$store.getModule(this.reference).getMany({
        fields: {
          [this.reference]: this.getFields,
        },
        include: this.include,
        filter: {
          ...this.filter,
          ...ids,
        },
      });
      this.loading = false;
      return data.data;
    },
  },
};
