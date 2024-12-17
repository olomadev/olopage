/**
 * For input components that allow multiple value as array.
 */
export default {
  props: {
    /**
     * Value to be edited. Array by default if multiple.
     * @model
     */
    modelValue: {
      type: [String, Array],
      default() {
        return null;
      },
    },
    /**
     * Allow input to accept multiple value as array.
     */
    multiple: Boolean,
    /**
     * Use full filled background color style.
     */
    variant: {
      type: String,
      default() {
        return "filled";
      },
    },
    /**
     * Use chips for each item. Enabled if `multiple` by default.
     */
    chips: {
      type: Boolean,
      default() {
        return false;
      },
    },
    /**
     * Use small chips.
     */
    smallChips: Boolean,
  },
};
