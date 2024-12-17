<template>
  <v-footer>
    <v-row :style="getLeftPadding" align="center" no-gutters>
      <v-col>
        <slot name="left"></slot>
      </v-col>
      <v-col
        v-for="(item, i) in menu"
        :key="i"
        class="text-center mb-sm-0"
        cols="auto"
        >
          <a :style="getAStyle()" 
            :href="item.href"
            :to="item.link"
            class="px-3 grey--text text--darken-3"
            :target="item.href ? '_blank' : '_self'"
            v-text="item.text"
          />
      </v-col>
      <v-spacer class="hidden-xs-and-down" />
      <v-col cols="12" sm="auto">
        <div class="font-weight-light pt-sm-0 text-center">
          <!-- @slot Right side information. -->
          <slot name="right"></slot>
        </div>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script>
/**
 * Default customizable admin VFooter with possibility of corporate related links and infos.
 */
export default {
  props: {
    /**
     * Menu links
     */
    menu: {
      type: Array,
      default: () => [],
    },
  },
  inject: [],
  data() {
    return {
      leftPadding: "padding-left: 0px"
    }
  },
  computed: {
    getLeftPadding() {
      if (this.$store.getDrawer) {
        this.leftPadding = 'padding-left: 256px';
      } else {
        this.leftPadding = 'padding-left: 0px';
      }
      return this.leftPadding;
    }
  },
  created() {
    if (this.$store.getDrawer) {
      this.leftPadding = 'padding-left: 256px';
    } else {
      this.leftPadding = 'padding-left: 0px';
    }
  },
  methods: {
    getAStyle() {
      let themeColor = this.$vuetify.theme.themes.defaultTheme.colors.primary;
      return 'color: ' + themeColor + ';';
    }
  }
};
</script>