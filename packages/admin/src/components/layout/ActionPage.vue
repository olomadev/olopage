<template>
  <div v-if="disableCard">
    <div class="d-flex align-center mb-2">
      <h1 class="h1">
        {{ title }}
      </h1>
      <v-spacer></v-spacer>
      <!-- @slot Action buttons placeholder. -->
      <slot name="actions"></slot>
    </div>
    <!-- @slot Page content placeholder. -->
    <slot></slot>
  </div>
  <div v-else>
    <v-card variant="flat" :border="border">
      <v-card-text>
        <div class="d-flex align-center mb-2">
          <h1 class="h1 mb-1">
            {{ title }}
          </h1>
          <v-spacer></v-spacer>
          <!-- @slot Action buttons placeholder. -->
          <slot name="actions"></slot>
        </div>
        <!-- @slot Page content placeholder. -->
        <slot></slot>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import Page from "../../mixins/page";

/**
 * Main CRUD action page layout used for Show, Create end Edit views components.
 */
export default {
  mixins: [Page],
  props: {
    border: Boolean,
    disableCard: Boolean,
  }
};
</script>
