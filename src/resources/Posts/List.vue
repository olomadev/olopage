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
          source: "authorId",
          type: "select",
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
          source: "published",
          sortable: true,
        },
        {
          source: "createdAt",
          sortable: true,
        },
      ],
    };
  }
};
</script>
