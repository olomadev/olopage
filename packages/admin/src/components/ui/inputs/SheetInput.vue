<template>
  <div>
    <div class="flex justify-center text-center noselect">
      
      <div id="sheetFileInputPreview_wrapper" 
        class="pt-10 pb-10 bg-gray-100" 
        style="border: 2px dashed #cfcfcf;" 
        @dragover="dragover" 
        @dragleave="dragleave" 
        @drop="drop"
      >
        <input hidden 
          type="file" 
          multiple="false" 
          :accept="sheets" 
          name="fields[sheetFileInput][]" 
          id="sheetFileInput" 
          class="w-px h-px opacity-0 overflow-hidden absolute" 
          @change="onChange" 
          ref="file" 
        />

          <div v-if="loading">
            <p>
              {{ $t("va.sheetImport.loadingMessage") }}
            </p>
          </div>

          <div v-if="!loading">

            <div v-if="file" class="text-subtitle-2 p-1">
              {{ file.name }} 
            </div>

            <div v-if="file" class="mt-2">
              <v-btn 
                v-if="loadingPreview"
                class="mr-2"
                @click="cancelUpload()"
                >
                {{ $t("va.actions.cancel") }}
              </v-btn>
              <v-btn
                :loading="loadingPreview"
                @click="remove()"
              >
               {{ $t("va.actions.remove") }}
              </v-btn>
            </div>

            <label v-if="!file && items.length == 0" for="sheetFileInput" style="color:gray; cursor: pointer;">
              <v-icon v-if="icon" :size="iconSize" :icon="icon"></v-icon>
              <div class="mt-2 text-caption">
                {{ $t("va.sheetImport.dragDropMessage") }}
              </div>
            </label>

          </div>
      </div>

      <v-alert
        v-if="validationError"
        variant="outlined"
        type="error"
        class="mt-4"
      >
        {{ $t("va.sheetImport.errorMessage") }}
      </v-alert>

      <div class="sheet-input-datatable">
        <v-data-table
          class="mt-4"
          :density="density"
          v-if="headers && headers.length > 0 && items && items.length > 0"
          v-model:items-per-page="perPage"
          :headers="headers"
          :items="items"
          item-value="name"
        >        
          <template v-slot:item="{ item }">
            <tr>
              <td v-for="field in headers" :class="hasError(field, item) ? 'parseError' : ''">
                <span v-if="hasError(field, item)" style="color: red;">
                  <v-menu open-on-hover>
                    <template v-slot:activator="{ props }">
                      <v-btn
                        color="red"
                        variant="text"
                        size="x-small"
                        v-bind="props"
                        style="font-size: 11px;text-transform: none;font-weight:400;"
                      >
                        <span v-if="item[field.key].value">{{ item[field.key].value }}</span>
                        <span v-else>{{ $t("va.sheetImport.requiredField") }}</span>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item
                        v-for="(err, errIndex) in item[field.key].errors"
                        :key="field.key + errIndex"
                      >
                        <v-list-item-title style="color:red;">{{ err }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </span>
                <span v-else>
                  {{ item[field.key].value }}
                </span>
              </td>
            </tr>
          </template>
        </v-data-table>
      </div>

    </div>
  </div>
</template>

<script>
import axios from "axios";
import InputWrapper from "../../../mixins/input-wrapper";
import { EventSourcePolyfill } from 'event-source-polyfill';
import cookies from "olobase-admin/src/utils/cookies";
const cookieKey = JSON.parse(import.meta.env.VITE_COOKIE);

export default {
  inject: [],
  mixins: [InputWrapper],
  props: {
    itemsPerPage: {
      type: [Number, String],
      default() {
        return 100
      },
    },
    iconSize: {
      type: String,
      default() {
        return "x-large"
      },
    },    
    icon: {
      type: String,
      default() {
        return ""
      },
    },
    uploadUrl: {
      type: String
    },
    previewUrl: {
      type: String
    },
    removeUrl: {
      type: String
    }
  },
  data() {
    return {
      cancel: false,
      eventSource: null,
      loading: false,
      loadingPreview: false,
      validationError: false,
      headers: [],
      items: [],
      perPage: 20,
      sheets: [
        "xlsx",
        "xls",
      ],
      file: null,
    }
  },
  created() {
    this.perPage = 20;
  },
  methods: {
    hasError(field, item) {
      if (typeof field.key == "undefined") {
        return false;
      }
      if (typeof item[field.key].errors !== 'undefined' && 
        item[field.key].errors.length > 0) {
        return true;
      }
      return false;
    },
    getSupportedExtensions() {
      return this.sheets.map(function(x) { return "." + x; }).join(",");
    },
    dragover(event) {
      event.preventDefault();
      // Add some visual fluff to show the user can drop its files
      if (!event.currentTarget.classList.contains('bg-green-300')) {
        event.currentTarget.classList.remove('bg-gray-100');
        event.currentTarget.classList.add('bg-green-300');
      }
    },
    dragleave(event) {
      this.loading = true
      // Clean up
      event.currentTarget.classList.add('bg-gray-100');
      event.currentTarget.classList.remove('bg-green-300');
    },
    drop(event) {
      event.preventDefault();
      this.$refs.file.files = event.dataTransfer.files;
      this.onChange(); // Trigger the onChange event manually

      // Clean up
      event.currentTarget.classList.add('bg-gray-100');
      event.currentTarget.classList.remove('bg-green-300');
    },
    remove() {
      this.reset()
      if (this.eventSource) {
        this.eventSource.close();  
      }
      let el = document.getElementById('sheetFileInputPreview_wrapper')
      el.classList.add('bg-gray-100');
      el.classList.remove('bg-green-300');
      this.admin.http({ method: "DELETE", url: this.removeUrl });
    },
    cancelUpload() {
      this.remove();
      this.$admin.http({ method: "DELETE", url: this.removeUrl });
    },
    reset() {
      this.file = null;
      this.items = [];
      this.header = [];
      this.loading = false;
      this.validationError = false;
      if (this.eventSource) {
        this.eventSource.close();  
      }
      this.$emit("importedItems", this.items, this.validationError);
      document.getElementById('sheetFileInput').value = ""; // reset input
    },
    async onChange() {
      this.cancel = false;
      this.loading = true;
      let Self = this;
      let el = document.getElementById('sheetFileInputPreview_wrapper')
      el.classList.add('bg-green-300');
      this.file = this.$refs.file.files[0];
      let formData = new FormData();
      formData.append('file', this.file);
      axios.defaults.headers.common['Content-Type'] = "multipart/form-data"; // change default content type as multipart
      let errorMessage = "";
      try {
        let response = await axios.post(this.uploadUrl, formData);
        if (response && response["status"] && response.status === 200) {
          this.importPreview();
        }
      } catch (e) {
        if (e && e.response && e.response["status"] && e.response.status === 400) {
          if (e.response["data"] && typeof e.response.data.error !== "undefined") { // development errors
            errorMessage = e.response.data.error;
          } else if (typeof e.response.data.data.error.file[0] !== "undefined") { // application errors
            errorMessage = e.response.data.data.error.file[0];
          }
          this.$store.getModule("messages").show({ type: 'error', message: errorMessage });
          this.loading = false;
          this.remove();
        }
      }
      this.loading = false;
      el.classList.add('bg-gray-100');
      el.classList.remove('bg-green-300');
      axios.defaults.headers.common['Content-Type'] = "application/json"; // restore default content type
    },
    async importPreview() {
      await this.createEventSource();
    },
    cancelPreview() {
      this.cancel = true;
      this.loading = false;
      this.headers = [];
      this.items = [];
      this.validationError = false;
      this.$emit("importedItems", [], false);
      this.loadingPreview = false;
      if (this.eventSource) {
        this.eventSource.close();
      }
    },
    async createEventSource() {
      this.loadingPreview = true;
      const Self = this;
      const auth = await this.$store.getModule("auth").checkAuth();
      const API_BASE_URL = import.meta.env.VITE_API_URL;
      this.eventSource = new EventSourcePolyfill(API_BASE_URL + '/stream/events?userId=' + auth.user.id + '&route=upload', 
          {
              headers: {
                'Authorization': 'Bearer ' + cookies.get(cookieKey.token)
              }
          }
      );
      this.eventSource.onerror = function (event) {
        if (event.status == 401) { // token expired
          Self.eventSource.close(); // close current event
          setTimeout(function() {
            Self.createEventSource();
          }, 3000);
          Self.$admin.http.post("/auth/session"); // refresh token
        }        
      };
      this.eventSource.onmessage = (e) => {
        if (e.data) {
          let data = JSON.parse(e.data);
          if (data.status == 1 || data.status == true) {
            Self.eventSource.close(); // lets close it when the process is done !
            //
            // get results with Axios
            //
            axios.get(Self.previewUrl).then((response) => {
              if (response 
                && response["status"] 
                && response.status === 200 
                && response.data.data.status) {
                  let results = response.data.data.results;
                  Self.validationError = response.data.data.validationError
                  Self.headers = results[0];
                  results.shift(); // remove header
                  Self.items = results;
                  Self.$emit("importedItems", results, Self.validationError);
                  Self.loadingPreview = false
              }
            });                
          }
        }
      }; 
    },
  }
}
</script>
