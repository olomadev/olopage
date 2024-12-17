<template>
  <div :class="class">
    <v-data-table
      :headers="headers"
      :items="getItems"
      :density="density"
    >
      <template v-slot:top>
        <v-row no-gutters>
          <v-col lg="6" align="left">
            <h4 class="h4 mb-2">{{ title }}</h4>
          </v-col>
          <v-col lg="6" align="right">
            <v-btn variant="plain" @click="createRowForm()" color="green-darken-1" icon>
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </template>

      <template v-for="(_, scopedSlotName) in $slots" v-slot:[scopedSlotName]="slotData">
        <slot :name="scopedSlotName" v-bind="slotData" />
      </template>

      <template v-slot:headers="{ columns }">
        <tr>
          <template v-for="column in columns" :key="column.key">
            <th>
              {{ getTitleLabel(column) }}
            </th>
          </template>
        </tr>
      </template>

      <template
        v-for="field in getFields"
        v-slot:[`item.${field.source}`]="{ item }"
      >
        <template v-if="item._new || item[primaryKey] === editRowId">
          <div class="mt-5">
            <slot :name="`input.${field.source}`" v-bind="{ field, item, editRowId }"></slot>
          </div>
        </template>
        <template v-else>
          <slot name="show" v-bind="{ field, item, editRowId }" />
          <span
            v-if="field.type == 'select'"
            :key="field.source"
            >
            {{ getSelectLabel(item, field.source) }}
          </span>
          <span v-else-if="field.type == 'custom'">
            <slot :name="`field.${field.source}`" v-bind="{ item }"></slot>
          </span>
          <span v-else-if="field.type">
            <component
              :source="field.sourceLabel ? field.sourceLabel : field.source"
              :is="`va-${field.type}-field`"
              :resource="resource"
              :item="item"
              variant="outlined"
              :options="getOptions(field)"
              v-bind="field.attributes"
              v-slot="props"
            >
              <slot
                :name="`field.${field.source}`"
                :item="props.item || item"
                v-bind="props"
              ></slot>
            </component>
          </span>
          <span v-else>
            <slot :name="`field.${field.source}`" v-bind="{ item, value }">
              {{ item[field.source] }}
            </slot>
          </span>
        </template>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-icon
          size="large"
          class="mr-2"
          color="green-darken-1"
          v-if="item._new || item[primaryKey] === editRowId"
          @click="saveItem()"
          style="font-size: 1.2rem !important;"
        >
          mdi-content-save
        </v-icon>
        <v-icon
          size="large"
          color="red-darken-1"
          v-if="item._new || item[primaryKey] === editRowId"
          @click="cancel"
          style="font-size: 1.2rem !important;"
        >
          mdi-close
        </v-icon>
        <v-icon
          size="small"
          color="blue-darken-1"
          v-if="!item._new && item[primaryKey] != editRowId"
          @click="editItem(item)"
          style="font-size: 1.2rem !important;"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          size="small"
          color="red-darken-1"
          v-if="!item._new && item[primaryKey] != editRowId"
          @click="deleteItem(item)"
          style="font-size: 1.2rem !important;"
        >
          mdi-delete
        </v-icon>
      </template>
      <template #bottom></template>

      <template v-slot:no-data>
        <div style="font-size: 12px;color: #7a7a7a; padding-top: 20px; padding-bottom: 20px">
          {{ $t("datatable.no_data_available") }}
        </div>
      </template>
    </v-data-table>

    <div class="v-input__details" v-for="error in getErrorMessages">
      <div class="v-messages" style="color: rgb(var(--v-theme-error));" role="alert">
        <div class="v-messages__message">{{ error }}</div>
      </div>
    </div>

    <v-dialog v-model="dialogDelete" max-width="500">
      <v-card>
        <v-card-title class="text-h5"></v-card-title>
        <v-card-text>
          {{ $t("dialog.deleteConfirm") }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="cancel">{{ $t("dialog.closeDeleteButton") }}</v-btn>
          <v-btn color="green darken-1" text @click="deleteConfirm">{{ $t("dialog.confirmDeleteButton") }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Utils from "../../../mixins/utils";
import Input from "../../../mixins/input";
import Resource from "../../../mixins/resource";

/**
 * Array layout for array elements
 */
export default {
  mixins: [Input, Resource, Utils],
  emits: ['validate', 'save', 'delete', 'edit'],
  inject: {
    v$: {
      default: null
    }
  },
  props: {
    class: {
      type: String,
      default() {
        return "va-array-table-input mb-5"
      },
    },
    title: {
      type: String,
    },
    headers: {
      type: Array,
      default: [],
    },
    fields: {
      type: Array,
      default: [],
    },
    primaryKey: {
      type: String
    },
    createId: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogDelete: false,
      form: null,
      editedIndex: -1,
      editRowId: null,
      editItems: [],
    }
  },
  computed: {
    getErrorMessages() {
      if (Array.isArray(this.errorMessages) 
        && this.errorMessages.length > 0) {
        return this.errorMessages;  
      }
      return null;
    },
    getItems() {
      if (this.form && !this.editRowId) {
        let items = [{ _new: true }, ...this.editItems];
        return items;
      }
      return this.editItems;
    },
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
              this.resource,
              f.labelKey || f.source
            ),
          };
        });
      if (this.primaryKey) {
        fields[this.primaryKey] = null;  
      }
      return fields;
    },
  },
  created() {
    // update input
    this.editItems = Array.isArray(this.input) ? this.input : [];
  },
  watch: {
    dialogDelete(val) {
      val || this.close();
    },
    editItems: {
      handler(newValue) { // https://vuejs.org/guide/essentials/watchers.html#deep-watchers
        this.update(newValue);
      },
      deep: true
    }
  },
  methods: {
    getOptions(field) {
      if (field && Object.prototype.hasOwnProperty.call(field, "options")) {
        return field.options;
      }
      return
    },
    getTitleLabel(column) {
      if (column.title) {
        return column.title;
      } else if (column.key) {
        return this.$admin.getSourceLabel(this.resource, column.key);  
      }
      return
    },
    getSelectLabel(item, source) {
      if (item 
        && item[source] 
        && typeof item[source]["name"]) {
        return item[source].name
      }
      return null
    },
    editItem(item) {
      this.$emit("edit", item);
      this.createRowForm("edit", item);
      this.editedIndex = this.editItems.indexOf(item);
    },
    createRowForm(action = "new", item = null) {
      const Self = this;
      this.$emit("validate", false);
      this.form = this.fields
        .map((f) => f)
        .reduce(function(o, f) {
          return {
            ...o,
            [f.source]: Self.getValue(action, f, item),  // default value
          };
        }, {});
      if (action == "new") {
        this.editRowId = null;
        this.form[this.primaryKey] = this.createId ? this.generateUid() : null;
      } else {
        this.editRowId = item ? item[this.primaryKey] : null;
      }
      this.$store.getResource(this.resource).setRow(this.form);
    },
    getValue(action, f, item) {
      if (f && Object.prototype.hasOwnProperty.call(f, "value")) {
        return f.value;
      }
      if (f['type'] && f['type'] == 'custom') {
        let values = {};
        if (action == "new" && f['items']) { // object values
          for (let key in f['items']) {
            values[f['items'][key]['id']] = null;
          }
          return values;
        } else if (action == "edit" && f['items']) {
          if (! item[f.source]) { // empty edit case
            item[f.source] = {};
            for (let key in f['items']) {
              item[f.source][f['items'][key]['id']] = null;
            }
          } else {
            return item[f.source];
          }
          return item[f.source];
        }
      } else if (item) {
        return item[f.source];
      }
      return null;
    },
    saveItem() {
      const Self = this;
      let invalid = false;
      this.$emit("validate", this.form);
      if (this.v$['$externalInvalid'] && this.v$.$externalInvalid) {
        invalid = true;
      }
      this.getFields.forEach(function(val){
        if (! Self.v$[Self.source + 'Form']) {
          return;
        }
        if (Self.v$[Self.source + 'Form'][val.source]) {
          Self.v$[Self.source + 'Form'][val.source].$touch();
          if (Self.v$[Self.source + 'Form'][val.source].$invalid) {
            invalid = true
          }    
        }
      })
      if (invalid) {
        return;
      }
      if (this.editedIndex > -1) {
        Object.assign(this.editItems[this.editedIndex], this.form);
      } else {
        this.editItems.push(this.form);
      }
      this.$emit("save", this.form);
      this.$emit("validate", false);
      this.update(this.input);
      this.close();
    },
    deleteItem(item) {
      this.editedIndex = this.editItems.indexOf(item);
      this.dialogDelete = true;
    },
    deleteConfirm() {
      this.$emit("delete", this.editItems[this.editedIndex]);
      this.editItems.splice(this.editedIndex, 1);
      this.update(this.input);
      this.close();
    },
    cancel() {
      this.close();
    },
    close() {
      this.$nextTick(async () => {
        this.editedIndex = -1;
        this.v$.$reset();
      });
      this.form = null;
      this.editRowId = null;
      this.$store.getResource(this.resource).setRow(null);  // reset form variable
      this.dialogDelete = false;
    }
  },
};
</script>