<template>
  <span>{{ getText }}</span>
</template>

<script>
import Field from "../../../mixins/field";

/**
 * Show value as simple text, render a simple span. HTML tags will be stripped.
 */
export default {
  mixins: [Field],
  props: {
    options: {
      type: Object,
      default() {
        return { currency: "USD", precision: 2 } 
      },
    },
  },
  computed: {
    getText() {
      if (this.value == null || isNaN(this.value)) { // for emty values
        return;
      }
      let supportedCurrencies = ["USD", "EUR", "TRY"]
      if (typeof this.options.currency == 'undefined' || ! supportedCurrencies.includes(this.options.currency)) {
        return new Intl.NumberFormat("en-EN", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(this.value)        
      }
      let formattedValue = this.value
      let country = null
      let precision = 2
      switch(this.options.currency) {
        case "USD":
          country = this.options.country ? this.options.country : "en-EN"
          precision = this.options.precision ? this.options.precision : 2
          formattedValue = new Intl.NumberFormat(country, { style: "currency", currency: "USD", minimumFractionDigits: precision }).format(this.value)
          break;
        case "EUR":
          country = this.options.country ? this.options.country : "de-DE"
          precision = this.options.precision ? this.options.precision : 2
          formattedValue = new Intl.NumberFormat(country, { style: "currency", currency: "EUR", minimumFractionDigits: precision }).format(this.value)
          break;
        case "TRY":
          country = this.options.country ? this.options.country : "tr-TR"
          precision = this.options.precision ? this.options.precision : 2
          formattedValue = new Intl.NumberFormat(country, { style: "currency", currency: "TRY", minimumFractionDigits: precision }).format(this.value)
          break;
        default:
          country = this.options.country ? this.options.country : "en-EN"
          precision = this.options.precision ? this.options.precision : 2
          formattedValue = new Intl.NumberFormat(country, { style: "currency", currency: "USD", minimumFractionDigits: precision }).format(this.value)
          break;
      }
      return formattedValue
    },
  },
};
</script>