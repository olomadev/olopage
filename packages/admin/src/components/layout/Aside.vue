<template>
  <v-navigation-drawer
    disable-resize-watcher
    :location="location"
    :width="width"
    v-model="opened"
  >
    <div class="pa-4">
      <div class="d-flex align-center">
        <h3 class="h1">
          <portal-target name="aside-title"></portal-target>
        </h3>
        <v-btn class="close" icon @click="handleClose">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
      <div class="content">
        <portal-target
          name="aside-content"
          @change="handleUpdate"
        ></portal-target>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script>
import { useDisplay } from 'vuetify'
/**
 * Customizable admin aside component where you put some contextualized additional information.
 * Use the associated `VaAsideLayout` component for content integration from anywhere on any context.
 */
export default {
  setup () {
    // Destructure only the keys we want to use
    const { lgAndUp } = useDisplay()
    return { lgAndUp }
  },
  props: {
    /**
     * Positions: 'top' | 'end' | 'bottom' | 'start' | 'left' | 'right'
     */
    location: {
      type: String,
      default: "left",
    },
    /**
     * Width of the aside
     */
    width: {
      type: Number,
      default: 400,
    },
  },
  data() {
    return {
      opened: false,
    };
  },
  methods: {
    handleClose() {
      this.opened = false
    },
    handleUpdate(newContent) {
      if (newContent instanceof Object && 
        newContent.hasOwnProperty('hasContent') && 
        newContent.hasContent
      ) {
        this.opened = true;
      } else {
        this.opened = false;
      }      
    },
  },
};
</script>

<style scoped>
.close {
  position: absolute;
  right: 1rem;
}
.content {
  margin-top: 3rem;
}
</style>
