/**
 * Common props for all choices based fields or inputs.
 */
export default {
  created() {
    let results = []
    let enumKey = `resources.${this.resource}.enums.${this.source}`;
    let enums = this.$admin.i18n.global.tm(enumKey)
    if (!enums) {
      return;
    }
    results = Object.keys(enums).map((key) => {
      return {
        id: key,
        name: enums[key].source,
      };
    });
    if (Array.isArray(results) && results.length > 0) {
      let Self = this
      results.forEach(function(val, index){
        Self.choices[index] = val
      });
    }
  },
  props: {
    /**
     * Attribute for showing text.
     */
    itemText: {
      type: [String, Array, Function],
      default: "name",
    },
    /**
     * Attribute where taking the value from.
     */
    itemValue: {
      type: [String, Array, Function],
      default: "id",
    },
    /**
     * List of choices for select.
     * Takes localized enums from your VueI18n resources locales by default.
     */
    choices: {
      type: Array,
      default() {
        return []
      },
    },
  },
};
