<template>
  <span>{{ dateFormatted(value) }}</span>
</template>

<script>
import config from "@/_config";
import Field from "../../../mixins/field";

/**
 * Show value as formatted date. Support any localized format, long, short, etc.
 * Use `$d` VueI18n function under the hood.
 *
 * https://vue-i18n.intlify.dev/guide/essentials/datetime
 */
export default {
  mixins: [Field],
  inject: ['i18n'],
  props: {
    /**
     * The date format to use. For example: (dd-mm-YYYY).
     */
    format: {
      type: String,
      default() {
        return  null;
      },
    },
  },
  methods: {
    getSelectedFormat() {
      if (this.format) {
        return this.format;
      }
      return config.i18n[this.i18n.global.locale.value].dateFieldDisplayFormat;
    },
    dateFormatted(val) {
      if (val) {
        return this.formatDateForDisplay(val);
      }
    },
    formatDateForDisplay(val) {
      const dateFormat = this.getSelectedFormat();
      const seperatorArray = dateFormat.match(/(\.)|(-)|(\/)|(\\)/);
      let s = "-"; // default seperator
      if (Array.isArray(seperatorArray)) {
        s = seperatorArray[0];
      }
      const locale = this.i18n.global.locale.value;
      const date = new Date(val);
      let month = 1 + date.getMonth();
      if (month < 10) {
        month = `0${month}`;
      }
      let day = date.getDate();
      if (day < 10) {
        day = `0${day}`;
      }
      let year = date.getFullYear();
      switch (dateFormat) {
        case 'dd' + s + 'mm' + s + 'YYYY':
          return `${day}${s}${month}${s}${year}`;
          break;
        case 'mm' + s + 'dd' + s + 'YYYY':
          return `${month}${s}${day}${s}${year}`;
          break;
        case 'YYYY' + s + 'mm' + s + 'dd':
          return `${year}${s}${month}${s}${day}`;
          break;
        case 'YYYY' + s + 'dd' + s + 'mm':
          return `${year}${s}${day}${s}${month}`;
          break;
        default:
          return `${day}${s}${month}${s}${year}`;
      }
    }
  },
};
</script>