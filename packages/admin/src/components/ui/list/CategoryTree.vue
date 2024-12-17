<template>
  <v-card border rounded flat class="pt-2 pl-0 pb-2 pr-0">
    <v-col>
      <v-row no-gutters>
        <v-col cols="12" lg="6">
          <va-text-input
            source="search"
            v-model="search"
            variant="outlined"
            clear-icon="mdi-close-circle-outline"
            :label="$t('va.actions.q')"
            clearable
            hide-details
            solo-inverted
          >
          </va-text-input>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12" lg="6">
          <!-- v-model:selected="listState.selected" -->
          <v-treeview
            :search="search"
            :custom-filter="searchFilter"
            selected-color="primary"
            :density="density"
            :open-all="openAll"
            :items="items"
            item-value="id"
          >
            <template v-for="(_, scopedSlotName) in $slots" v-slot:[scopedSlotName]="slotData">
              <slot v-if="scopedSlotName" :name="scopedSlotName" v-bind="slotData" />
            </template>

            <template v-slot:title="{ item }">
              <div class="mt-2 mb-2" v-if="item.id === editRowId">
                <va-text-input
                  source="title"
                  :resource="listState.resource"
                  :item="item"
                  v-model="categoryTreeForm['title']"
                  :label="$t('va.categories.title')"
                  :error-messages="getErrorMessage('title')"
                  hide-details
                >
                </va-text-input>
                <va-boolean-input
                  class="mb-1"
                  v-model="categoryTreeForm['move']"
                  color="primary"
                  :label="$t('va.categories.move')" 
                  @click.stop
                  hide-details
                >
                </va-boolean-input>
                <va-select-input
                  v-if="categoryTreeForm['move']"
                  class="mb-3"
                  source="parentId"
                  :resource="listState.resource"
                  :item="item"
                  v-model="categoryTreeForm['parentId']"
                  reference="categories"
                  :label="$t('va.categories.parentId')"
                  :error-messages="getErrorMessage('parentId')"
                  :return-object="false"
                  hide-details
                >
                </va-select-input>
                <div>
                  <v-btn
                    class="mr-2"
                    color="primary"
                    @click="saveItem($event)"
                  >{{ $t('va.actions.save') }}
                  </v-btn>
                  <v-btn
                    color="secondary"
                    @click="cancel($event)"
                  >{{ $t('va.actions.cancel') }}
                  </v-btn>
                </div>
              </div>
              <div v-else>
                <span>{{ item.title }}</span>
                <span>&nbsp;&nbsp;</span>
                <span>
                  <va-edit-button
                    disable-redirect
                    class="mr-2"
                    :resource="listState.resource"
                    :item="item"
                    icon
                    @click="editItem(item)"
                  ></va-edit-button>
                  <va-delete-button
                    :resource="listState.resource"
                    icon
                    :item="item"
                    disable-delete
                    @delete="deleteItem(item)"
                  ></va-delete-button>
                </span>
              </div>
            </template>

          </v-treeview>
        </v-col>
      </v-row>
    </v-col>
  </v-card>
</template>

<script>
import Utils from "../../../mixins/utils";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

export default {
  mixins: [Utils],
  inject: ["listState"],
  props: {
    density: {
      type: String,
      default: "compact",
    },
    openAll: {
      type: Boolean,
      default() {
        return false
      },
    },
    url: {
      type: String,
      default: "/categories/findAllByPaging",
    },
  },
  setup() {
    return { tv$: useVuelidate() }
  },
  validations() {
    return {
      categoryTreeForm: {
        title: {
          required,
        },  
      }
    }
  },
  async created() {
    this.listState.loading = true;
    let response = await this.$admin.http.get(this.url);
    if (response && 
        response['data'] 
        && response['data']['data']) {
      this.items = response['data']['data'];
    }
    //
    // Search filter
    // 
    this.searchFilter = function (value, search, item) {
      return value.toLowerCase().indexOf(search.toLowerCase()) > -1
    }
    this.listState.loading = false;
  },
  data() {
    return {
      move: false,
      search: null,
      searchFilter: null,
      items: [],
      // ------ editable row items ------//
      categoryTreeForm: {},
      editRowId: null,
      editedItem: null,
      fields: [
        {
          source: "title",
          type: "text",
          label: this.$t("va.categories.title")
        },
        {
          source: "move",
          type: "boolean",
          label: this.$t("va.categories.move")
        },
        {
          source: "parentId",
          type: "select",
          attributes: {
            reference: "categories",
          },
          label: this.$t("va.categories.parentId")
        },
      ],
    }
  },
  computed: {
    getFields() {
      let fields = this.fields
        .map((f) => {
          return typeof f === "string"
            ? {
                source: f,
              }
            : f;
        })
        .map((f) => {
          return {
            ...f,
            type: f.type,
            label: f.label || this.$admin.getSourceLabel(
              this.listState.resource,
              f.labelKey || f.source
            ),
          };
        });
      fields['id'] = null;  
      return fields;
    },
  },
  methods: {
    getErrorMessage(source) {
      const errors = [];
      if (!this.tv$["categoryTreeForm"]['title'].$dirty) return errors;
      this.tv$["categoryTreeForm"]['title'].required.$invalid &&
        errors.push(this.$t("v.text.required"));
      return errors;
    },
    editItem(item) {
      this.editedItem = item;
      this.$emit("edit", item);
      this.createRowForm(item);
      event.stopPropagation();
    },
    createRowForm(item = null) {
      const Self = this;
      this.categoryTreeForm = this.fields
        .map((f) => f)
        .reduce(function(o, f) {
          return {
            ...o,
            [f.source]: Self.getValue(f, item),  // default value
          };
        }, {});
      this.editRowId = item ? item['id'] : null;
    },
    getValue(f, item) {
      if (f && Object.prototype.hasOwnProperty.call(f, "value")) {
        return f.value;
      }
      if (item[f.source]) {
        return item[f.source];
      }
      return null;
    },
    saveItem(event) {
      const Self = this;
      event.stopPropagation();
      this.tv$['categoryTreeForm'].$touch();
      if (this.tv$.$invalid) {
        return false;
      }
      this.editedItem.title = this.categoryTreeForm.title;
      this.editedItem.move = 0;
      if (this.categoryTreeForm['parentId']) {
        this.editedItem.parentId = this.categoryTreeForm['parentId'];
      }
      if (this.categoryTreeForm['move']) {
        this.editedItem.move = this.categoryTreeForm['move'];
      }
      this.$emit("save", this.editedItem);
      this.close();
    },
    deleteItem(item) {
      this.$emit("delete", item);
      this.close();
    },
    cancel(event) {
      event.stopPropagation();
      this.close();
    },
    close() {
      this.$nextTick(async () => {
        this.tv$.$reset();
      });
      this.categoryTreeForm = null;
      this.editedItem = null;
      this.editRowId = null;
      this.dialogDelete = false;
    }
  },
};
</script>



