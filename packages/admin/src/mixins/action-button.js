/**
 * Common props for all type of action button.
 */
export default {
  props: {
    /**
     * Icon button, must be a valid MDI.
     */
    icon: String,
    /**
     * Label of button, shown as label next icon or as tooltip.
     */
    label: {
      type: String,
      required: false,
    },
    /**
     * Hide label next of icon. Will appear as tooltip.
     */
    hideLabel: {
      type: Boolean,
      default: false,
    },
    /**
     * Color of button.
     */
    color: {
      type: String,
      default: "primary",
    },
    /**
     * Show as text without background.
     */
    text: Boolean,
  },
  methods: {
    onClick(e) {
      /**
       * Stop propagation for row click events
       * 
       * https://stackoverflow.com/questions/60586059/how-i-can-separate-the-buttons-click-event-from-row-click-event-inside-a-row-in
       */
      if (e.stopPropagation) e.stopPropagation();

      /**
       * Triggered on click, send related item if available.
       */
      this.$emit("click", this.item)
    },
  },
};
