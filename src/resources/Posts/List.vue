<template>
  <va-list 
    :filters="filters"
    :fields="fields"
    hide-bulk-copy
    :disable-global-search="false"
  >
    <va-data-table-server
      :disable-actions="false"
      :disable-show="false"
    >
      <template v-slot:[`field.publishStatus`]="{ item }">
        <v-chip 
          label
          size="small"
          :color="getStatusColor(item.publishStatus)"
          >
          <v-icon icon="mdi-label" start></v-icon>
          {{ item.publishStatus }}
        </v-chip>
      </template>
    </va-data-table-server>
  </va-list>
</template>

<script>
export default {
  props: ["resource", "title"],
  data() {
    return {
      filters: [],
      fields: [
        {
          source: "title",
          sortable: true,
        },
        {
          source: "permalink",
          sortable: true,
        },
        {
          source: "categories",
          sortable: false,
        },
        {
          source: "tags",
          sortable: false,
        },
        {
          source: "publishStatus",
          sortable: true,
        },
        {
          source: "authorId",
          type: "select",
          sortable: true,
        },
        {
          source: "createdAt",
          sortable: true,
        },
      ],
    };
  },
  methods: {
    getStatusColor(val) {
      if (val == "draft") {
        return 'orange-darken-2';
      }
      if (val == "published") {
        return 'green-darken-2';
      }
      if (val == "pending") {
        return 'indigo-accent-2';
      }

    },
  }
};
</script>