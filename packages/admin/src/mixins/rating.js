/**
 * Common props for rating field and input components.
 */
export default {
  props: {
    /**
     * The applied color when the component is in an active state
     */
    activeColor: String,
    /**
     * Allows for the component to be cleared by clicking on the current value
     */
    clearable: Boolean,
    /**
     * Plain color for active ratings
     */
    color: {
      type: String,
      default: "primary",
    },
    /**
     * Adjusts the vertical height used by the component
     */
    density: String,
    /**
     * Removes the ability to click or target the component
     */
    disabled: Boolean,
    /**
     * The icon displayed when empty
     */
    emptyIcon: [String, Function],
    /**
     * The icon displayed when full
     */
    fullIcon: [String, Function],
    /**
     * Allows the selection of half increments
     */
    halfIncrements: {
      type: Boolean,
      default: false,
    },
    /**
     * Provides visual feedback when hovering over icons
     */
    hover: {
      type: Boolean,
    },
    /**
     * Position of item labels. Accepts 'top' and 'bottom'
     */
    itemAriaLabel: {
      type: String,
    },
    /**
     * Array of labels to display next to each item
     */
    itemLabels: Array,
    /**
     * Amount of ratings to show.
     */
    length: {
      type: [Number, String],
      default: 5,
    },
    /**
     * Sets the component’s name attribute.
     */
    name: {
      type: String,
    },
    /**
     * Removes all hover effects and pointer events.
     */
    readonly: Boolean,
    /**
     * Sets the height and width of the component. Default unit is px.
     * Can also use the following predefined sizes: x-small, small, default, large, and x-large.
     */
    size: {
      type: String,
    }
  },
};
