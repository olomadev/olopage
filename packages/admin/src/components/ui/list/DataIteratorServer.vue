<template>
<div :class="class">
  <form>
    <v-data-iterator 
      :items="getItems" 
      :modelValue="listState.selected"
      :items-length="listState.total ? listState.total : 0"
      :items-per-page="listState.options.itemsPerPage"
      :item-selectable="itemSelectable"
      :page="listState.options.page"
      :multi-sort="multiSort"
      :must-sort="mustSort"
      :expand-on-click="expandOnClick"
      :show-expand="showExpand"
      :select-strategy="selectStrategy"
      :show-select="showSelect"
      :options.sync="listState.options"
      :sort-by.sync="listState.options.sortBy"
      :group-by="groupBy"
      :return-object="returnObject"
      @update:modelValue="(v) => (listState.selected = v)"
      @update:items-per-page="updateItemsPerPage($event)"
    >
      <template v-for="(_, scopedSlotName) in $slots" v-slot:[scopedSlotName]="slotData">
        <slot v-if="scopedSlotName" :name="scopedSlotName" v-bind="slotData" />
      </template>

      <template v-slot:header>
        <div class="mb-5 text-center" v-if="pagination.top">

          <!-- top.pagination header -->
          <slot name="top.pagination.header" v-bind="{ page: listState.options.page, pageCount: getTotalPages }"></slot>
          <!-- top.pagination header -->

          <v-pagination
            v-if="getTotalPages > 0"
            :density="pagination.density"
            :rounded="pagination.rounded"
            :active-color="pagination.activeColor"
            v-model="listState.options.page"
            :length="getTotalPages"
            @update:modelValue="updatePage"
          ></v-pagination>

          <!-- top.pagination footer -->
          <slot name="top.pagination.footer" v-bind="{ page: listState.options.page, pageCount: getTotalPages }"></slot>
          <!-- top.pagination footer -->

        </div>
      </template>

      <template v-slot:footer>
        <div class="mt-5 mb-5 text-center" v-if="pagination.bottom">
          
          <!-- bottom.pagination header -->
          <slot name="bottom.pagination.header" v-bind="{ page: listState.options.page, pageCount: getTotalPages }"></slot>
          <!-- bottom.pagination header -->
          
          <v-pagination
            v-if="getTotalPages > 0"
            :density="pagination.density"
            :rounded="pagination.rounded"
            :active-color="pagination.activeColor"
            v-model="listState.options.page"
            :length="getTotalPages"
            @update:modelValue="updatePage"
          ></v-pagination>

          <!-- bottom.pagination footer -->
          <slot name="bottom.pagination.footer" v-bind="{ page: listState.options.page, pageCount: getTotalPages }"></slot>
          <!-- bottom.pagination footer -->

        </div>
      </template>
    </v-data-iterator>
  </form>
</div>
</template>

<script>
import Resource from "../../../mixins/resource"

/**
 * Data iterator component, you will need data iterator as `VaList` in order to make it usable.
 * This component allows you to template all fields columns.
 */
export default {
  mixins: [Resource],
  inject: {
    listState: { 
      default: {} 
    }
  },
  provide() {
    return {
      admin: this.admin,
    };
  },
  props: {
    class: {
      type: String,
      default() {
        return "va-data-iterator"
      },
    },
    /**
     * Pagination settings
     */
    pagination: {
      type: Object,
      default: {
        density: "default",
        activeColor: "primary",
        head: false, // Enable v-pagination for header
        foot: true,  // Enable v-pagination for footer
        rounded: "pill", // Set pagination rounded style: 0, sm, lg, xl, pill, circle, shaped
      },
    },
    /**
     * Enable row expand mode.
     * Use it for quick detail view.
     */
    showExpand: Boolean,
    /**
     * Only one row can expanded at once
     */
    expandOnClick: {
      type: Boolean,
      default: true,
    },
    /**
     * Group by array
     */
    groupBy: {
      type: Array
    },
    /**
     * Shows the column with checkboxes for selecting items in the list.
     */
    showSelect: Boolean,
    /**
     * Property on supplied items that contains the boolean value 
     * indicating if the item is selectable.
     */
    itemSelectable: String,
    /**
     * Select strategy 'single' | 'page' | 'all'
     */
    selectStrategy: {
      type: String,
      default: "page",
    }, 
    /**
     * Changes the selection behavior to return the object directly 
     * rather than the value specified with item-value.
     */
    returnObject: Boolean,
    /**
     * If true then one can not disable sorting, 
     * it will always switch between ascending and descending.
     */
    mustSort: Boolean,
    /**
     * Enable multi sort feature, enabled by default.
     */
    multiSort: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      selected: [],
    };
  },
  watch: {
    multiSort: {
      handler(val) {
        this.listState.options.multiSort = val;
      },
      immediate: true,
    },
    "selected"(val) {
        this.$emit("selected", val);
    },
  },
  computed: {
    getTotalPages() {
      let total = Math.ceil(this.listState.total / this.listState.options.itemsPerPage);
      return total;
    },
    getItems() {
      if (this.listState["items"] && this.listState.items.length > 0) { // add index numbers
        return this.listState.items.map((items, index) => ({
          ...items,
          index: index
        }))  
      }
      return this.listState.items;
    },
  },
  methods: {
    updatePage(page) {
      this.listState.options.page = page;
      this.listState.reload();
    },
    updateItemsPerPage(page) {
      this.listState.options.itemsPerPage = page
      this.listState.reload()
    },
  }

}
</script>