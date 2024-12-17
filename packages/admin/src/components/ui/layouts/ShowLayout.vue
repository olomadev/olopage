<template>
  <va-action-page 
    :title="title" 
    :disable-card="disableCard"
  >
    <template slot="actions">
      <va-list-button v-if="showList" :resource="resource" :item="item"></va-list-button>
      <va-edit-button v-if="showEdit" :resource="resource" :item="item"></va-edit-button>
      <!-- @slot Additional custom action buttons placeholder. -->
      <slot name="actions"></slot>
      <va-clone-button v-if="showClone" :resource="resource" :item="item"></va-clone-button>
      <va-delete-button v-if="showDelete"
        :resource="resource"
        :item="item"
        redirect
      ></va-delete-button>
    </template>
    <!-- @slot Page content placeholder. -->
    <slot></slot>
  </va-action-page>
</template>

<script>
import Page from "../../../mixins/page";

/**
 * Page layout for resource detail showing. It's the better place for made heavy usage of any VA fields.
 * Contain specific related action as deleting, cloning, editing as well as translation action.
 */
export default {
  mixins: [Page],
  props: {
    disableCard: {
      type: Boolean,
      default: false,
    },
    showList: {
      type: Boolean,
      default: true,
    },
    showClone: {
      type: Boolean,
      default: true,
    },
    showEdit: {
      type: Boolean,
      default: true,
    },
    showDelete: {
      type: Boolean,
      default: true,
    },
  }
};
</script>
