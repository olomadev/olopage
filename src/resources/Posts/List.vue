<template>
  <va-list    
    :filters="filters"
    :fields="fields"
    disable-settings
    hide-bulk-copy
    :disable-global-search="false"
  >
      <va-data-iterator-server
        :pagination="{ 
          density: 'default',
          activeColor: 'primary',
          top: false,
          bottom: true,
          rounded: 'pill',
        }"
      >
        <template v-slot:default="{ items }">
          <v-row no-gutters class="custom-flex-grid">
            <v-col
              v-for="(item, i) in items"
              :key="i"
              class="mb-3 custom-column"
            >
              <v-card :loading="$store.getModule('api').getLoading" flat rounded class="card-wrapper hover-card">
                <v-card-title class="d-flex">
                  <v-spacer class="custom-font-size">{{ getCreationDate(item.raw.createdAt) }}</v-spacer>
                   <v-chip
                    label
                    :color="getStatusColor(item.raw.publishStatus)"
                    class="position-absolute"
                    style="top: 38px; left: 13px;"
                    size="small"
                  >
                    <v-icon icon="mdi-label" start></v-icon>
                    {{ $t("resources.posts." + item.raw.publishStatus) }}
                  </v-chip>
                  <v-menu>
                    <template v-slot:activator="{ props }">
                      <v-btn variant="text" v-bind="props" class="icon-btn">
                        <template v-slot:prepend>
                          <v-icon>mdi-dots-vertical</v-icon>
                        </template>
                      </v-btn>
                    </template>
                    <v-list elevation="2">
                      <template v-for="(menuItem, index) in getMenuItems">
                        <v-list-item
                          v-if="menuItem.show"
                          :key="index"
                          @click.stop="menuItemClick(item, menuItem.value)"
                        >
                          <v-list-item-title>{{ menuItem.title }}</v-list-item-title>
                        </v-list-item>
                      </template>
                    </v-list>
                  </v-menu>
                </v-card-title>
                <router-link :to="{ name: 'posts_edit', params: { id: item.raw.id } }">
                  <v-img
                    src="https://example.com/image.jpg"
                    class="align-end"
                    height="220px"
                    cover
                  >
                    <v-card-subtitle class="mb-5" v-text="item.raw.title"></v-card-subtitle>
                  </v-img>
                </router-link>
              </v-card>
            </v-col>
          </v-row>              
        </template>

        <template v-slot:bottom.pagination.header="{ page, pageCount }">
          <v-footer class="text-body-3 mt-6 mb-2" style="padding:0;">
            <div>{{ $t("dataiterator.displaying_page", {page, pageCount}) }}</div>
          </v-footer>
        </template>

        <template v-slot:no-data>
          <v-row no-gutters class="bordered pt-1 pb-1 justify-center" v-if="$store.getModule('api').getLoading">
            <v-progress-circular
              color="primary"
              indeterminate
            ></v-progress-circular>
          </v-row>
          <v-row no-gutters class="bordered pt-2 pb-2 justify-center" v-else>
            {{ $t("va.datatable.nodata")}}
          </v-row>
        </template>
      </va-data-iterator-server>
  </va-list>
</template>

<script>
import { useDisplay } from 'vuetify';
import { formatDate } from "@/utils";
import config from "@/_config";
import Trans from "@/i18n/translation";

export default {
  props: ["resource", "title"],
  setup() {
    const { smAndDown } = useDisplay();
    return { smAndDown }
  },
  data() {
    return {
      menuItems: [
        { title: 'Preview', value: 'preview', show: true },
        { title: 'Duplicate', value: 'duplicate', show: true },
        { title: 'Delete', value: 'delete', show: true },
      ],
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
  computed: {
    getMenuItems() {
      return this.menuItems;
    },
  },
  methods: {
    getCreationDate(date) {
      const formattedDate = formatDate("F j, Y, g:i a", date, Trans.currentLocale)
      return formattedDate
    },
    async menuItemClick(item, key) {
      if (key === 'duplicate') {
        this.$router.push({ path: "/posts/create", query: { source: item.raw.id }})
      }
      if (key === 'delete') {
        const res = await this.$admin.http({ method: "DELETE", url: "/posts/delete/" + item.raw.id });
        if (res && res.status === 200) {
          setTimeout(() => {
            this.$admin.message("success", this.$t("resources.posts.messages.postDeletedSuccessfully"));
          }, 200);
          this.$admin.refresh()
        }
      }
    },
    getStatusColor(val) {
      if (val == "draft") {
        return 'orange-darken-3';
      }
      if (val == "published") {
        return 'green-darken-3';
      }
      if (val == "pending") {
        return 'indigo-accent-3';
      }
    },
  }
};
</script>

<style scoped>
  .hover-card {
    cursor: pointer;
    border: 2px solid #e0e0e0;
  }
  .hover-card:hover {
    border: 2px solid rgb(var(--v-theme-primary));
  }
  .icon-btn {
    min-width: 0; /* Shrinks the width of the button to the icon */
    padding: 0;
  }
  .custom-flex-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 16px; /* Add spacing between the columns */
  }
  .custom-column {
    flex: 1 1 calc(100% / 7); /* 7 row structure */
    box-sizing: border-box;
    max-width: 200px; /* Max width of 200px for each card */
  }
  .custom-font-size {
    font-size: 12px;
    padding-top: 8px;
    color: #b8b8b8;
  }
  .card-wrapper {
    min-height: 250px; /* Ensure the card doesn’t exceed 200px */
    max-width: 200px; /* Ensure the card doesn’t exceed 200px */
    width: 100%;
    margin: auto;
  }
  /* Responsive: Adjust layout for smaller screens */
  @media (max-width: 600px) {
    .custom-column {
      flex: 1 1 100%; /* 1 column layout on smaller screens */
    }
  }
</style>
