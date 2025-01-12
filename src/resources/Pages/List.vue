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
          source: "route",
          sortable: true,
        },
        {
          source: "title",
          sortable: true,
        },
        {
          source: "description",
          sortable: true,
        },
        {
          source: "publisStatus",
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
