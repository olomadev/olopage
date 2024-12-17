import Source from "./source";
import InputWrapper from "./input-wrapper";

/**
 * Main input mixin for all inputs used for resource property edition or creation.
 * Auto update the model of the parent form.
 * Use it to create your own input component.
 */
export default {
  mixins: [Source, InputWrapper],
  inject: {
    formState: { default: undefined },
  },
  props: {
    /**
     * By default, the source will be the final name that will be sent to the API for create/update.
     * This prop allows you to override this default behavior.
     */
    model: String,
    /**
     * Whether to understand is lazy model (Ersin)
     */
    lazy: false,  
  },
  data() {
    return {
      acceptValue: true,
      input: null,
      internalErrorMessages: [],
    };
  },
  watch: {
    value: {
      handler(val) {
        this.input = val;
      },
      immediate: true,
    },
  },
  computed: {
    uniqueSourceId() {
      return [this.parentSource, this.index, this.source]
        .filter((s) => s !== undefined)
        .join(".");
    },
    uniqueFormId() {
      return [this.parentSource, this.index, this.model || this.source]
        .filter((s) => s !== undefined)
        .join(".");
    },
    commonProps() {
      let label = '' // update for undefined checkbox labels
      if (this.type == 'boolean' && typeof this.source == 'undefined') {
        label = ''
      } else if (typeof this.source != 'undefined') {
        label = this.$t(this.resource + "." + this.source)
      }
      if (this.label) {
        label = this.label
      }
      return {
        label: label,
        value: this.input,
        prependIcon: this.prependIcon,
        appendIcon: this.appendIcon,
        hint: this.hint,
        rules: this.rules,
        errorMessages: [...this.errorMessages, ...this.internalErrorMessages],
        hideDetails: this.hideDetails,
        dense: this.dense,
        placeholder: this.placeholder,
        clearable: this.clearable,
      };
    },
  },
  methods: {
    getItem(value) {
      return value === undefined ? this.value : value;
    },
    change(value) {
      /**
       * Triggered on any user input interaction.
       */
      this.$emit("change", value);
    },
    update(value, returnFalse) {

       /**
        * Ersin: return-object support for Multiple Select inputs or Autocompleters
        *
        * If you uncomment below do codes you will get this warning 
        * when you change your master dropdown with select input which has the :key="exampleId"
        * 
        * [Vue warn]: Avoid using non-primitive value as key, use string/number value instead.
        */
       if (value && typeof value === "object" && Object.prototype.hasOwnProperty.call(value, 'id')) {
            value = value.id
       }
      /**
       * currency input no need to require update the value
       */
      if (returnFalse) {
        return
      }
      /**
       * Set value into input.
       */
      this.input = value;

      /**
       * Triggered if value updated.
       */
      this.$emit("input", value);
    },
  },
};
