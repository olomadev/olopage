<template>
  <v-row no-gutters class="mb-2">
    <v-col cols="12" md="8" lg="9" sm="12">
      <v-card flat border min-height="600">
        <v-card-title class="mt-3 d-flex">
          <v-spacer></v-spacer>
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
            </template>
            <v-list elevation="2">
              <v-list-item
                v-for="(item, index) in menuItems"
                :key="index"
                :value="index"
                @click="menuItemClick(item, item.value)"
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-card-title>
        <v-card-text>
          <BlockEditor 
            editorClass="my-12 prose xl:prose-xl text-slate-600 max-w-none"
            v-model="model.contentJson"
            :editable="editable"
            mode="json"
            :blockTools="blockTools"
            :blockWidthTypes="[
              'horizontalRule',
              'blockquote',
              'youtube',
            ]"
            @updateHtmlContent="setHtmlContent"
          ></BlockEditor>
        </v-card-text>
        <template v-slot:actions>
          <v-row align="center" justify="center">
            <a style="text-decoration: underline;font-size: 14px;color:gray;" href="javascript:void(0)">{{ getFrontEndUrl }}/{{ model.permalink }}</a>
          </v-row>
        </template>
      </v-card>
    </v-col>
    <v-col cols="12" md="4" lg="3" sm="12">
      <v-card flat 
        class="ml-lg-5 ml-md-5" 
        :style="smAndDown ? 'margin-top: 20px;' : ''" 
        border
      >
        <v-card-text>
          <v-btn v-if="publishStatus" flat prepend-icon="mdi-publish-off" color="red-darken-2">
            UnPublish
          </v-btn>
          <v-btn v-else flat prepend-icon="mdi-publish">
            Publish
          </v-btn>
          <v-btn class="mt-2" flat block prepend-icon="mdi-content-save" color="secondary">
            {{ $t('va.actions.save') }}
          </v-btn>
          <v-row no-gutters class="mt-5" v-if="!isNewPost">
            <v-col>
              <va-date-input 
                source="publishedAt" 
                label="Published on" 
                format="shortFormat"
              ></va-date-input>
            </v-col>
            <v-col>
              <va-text-input 
                class="ml-5 maska"
                source="publishedTime"
                v-maska="'##:##'"
              >
              </va-text-input>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-card flat 
        class="mt-5 ml-lg-5 ml-md-5" 
        :style="smAndDown ? 'margin-top: 20px;' : ''" 
        :subtitle="$t('resources.posts.categories')"
        border
      >
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="12">  

            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
  <v-dialog v-model="editPermalinkDialog" width="auto">
    <v-card
      max-width="400"
      prepend-icon="mdi-update"
      text="Your application will relaunch automatically after the update is complete."
      title="Update in progress"
    >
      <template v-slot:actions>
        <v-btn
          class="ms-auto"
          text="Ok"
          @click="editPermalinkDialog = false"
        ></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script>
import { useDisplay } from "vuetify";
import { useVuelidate } from "@vuelidate/core";
import BlockEditor from "@/components/block-editor/BlockEditor.vue";
import { required, maxLength, numeric } from "@vuelidate/validators";
import utils from "olobase-admin/src/mixins/utils";
import { provide } from 'vue'
import slugify from "slugify"
import Trans from "@/i18n/translation";
import sampleContent from "@/content.json";
import { vMaska } from "maska/vue"

export default {
  props: ["id", "item"],
  mixins: [utils],
  inject: {
    formState: { default: undefined },
  },
  directives: { maska: vMaska },
  components: {
    BlockEditor,
  },
  setup() {
    let vuelidate = useVuelidate();
    const { smAndDown } = useDisplay();
    provide('v$', vuelidate)
    return { v$: vuelidate, smAndDown }
  },
  data() {
    return {
      editPermalinkDialog: false,
      menuItems: [
        {
          title: 'Save (Ctrl + S)',
          value: 'save',
        },
        {
          title: 'Duplicate',
          value: 'duplicate',
        },
        {
          title: 'Copy Link',
          value: 'copy-link',
        },
        {
          title: 'Edit Permalink',
          value: 'edit-permalink',
        },
      ],
      editable: true,
      publishStatus: 0,
      model: {
        id: null,
        title: null,
        permalink: null,
        categories: null,
        contentJson: sampleContent,
        contentHtml: null,
        tags: null,
        published: null,
        publishedAt: null,
        publishedTime: null,
      },
      blockTools: [
        {
          name: "paragraph",
          tools: [
            {
              title: "Default",
              name: "default",
              icon: '<svg class="w-4 h-4 md:w-6 md:h-6" xmlns="http://www.w3.org/2000/svg" width="48" height="48"  viewBox="0 0 48 48"><path fill="currentColor" d="M33.52 13.16a13.63 13.63 0 0 0-.19 2.24v2.45l-.15.14h-.92l-.16-.13a16 16 0 0 0-.17-2.2A1 1 0 0 0 31 15h-4.76v12.39a32.3 32.3 0 0 0 .19 4.54.65.65 0 0 0 .5.55c.15 0 .72.08 1.71.14l.15.15v1l-.15.15c-1-.06-2.47-.09-4.51-.09s-3.59 0-4.51.09l-.13-.14v-1l.14-.15c1-.06 1.57-.11 1.72-.14a.65.65 0 0 0 .5-.55 34 34 0 0 0 .15-4.62V19c0-2.41 0-3.77-.05-4.07h-2.07a14.74 14.74 0 0 0-3.06.16.66.66 0 0 0-.33.22 3.28 3.28 0 0 0-.22.94c-.06.52-.11 1.05-.13 1.6L16 18h-.93l-.16-.14v-2.51a18.58 18.58 0 0 0-.17-2.18l.13-.15c.58.1 2.67.15 6.3.15h5.93q5 0 6.3-.15Z"/></svg>',
              command: (editor) => {
                editor.chain().focus().setVariant("default").run();
              },
              isActiveTest: (editor) => editor.isActive({ variant: "default" }),
            },
            {
              title: "Large",
              name: "large",
              icon: '<svg class="w-4 h-4 md:w-6 md:h-6" xmlns="http://www.w3.org/2000/svg" width="48" height="48"  viewBox="0 0 48 48"><path fill="currentColor" d="M41.37 6.12a27.85 27.85 0 0 0-.35 4L41 14.56l-.26.26h-1.69l-.29-.23a31.65 31.65 0 0 0-.29-4 1.83 1.83 0 0 0-1.69-1.24c-.35-.05-2-.08-5-.08h-3.49c0 .62-.05 3.06-.05 7.33v15a59.2 59.2 0 0 0 .34 8.18 1.14 1.14 0 0 0 .89 1 30 30 0 0 0 3.09.27l.26.26v1.77l-.26.26q-2.61-.16-8.12-.16t-8.12.16l-.24-.24v-1.8l.26-.26a29.7 29.7 0 0 0 3.09-.27 1.13 1.13 0 0 0 .89-1 58.62 58.62 0 0 0 .35-8.18v-15q0-6.51-.08-7.33h-3.77a27.11 27.11 0 0 0-5.51.29 1.12 1.12 0 0 0-.58.4 5.32 5.32 0 0 0-.4 1.69c-.12.93-.2 1.89-.24 2.87l-.26.26H8.17l-.29-.26L7.82 10a30.21 30.21 0 0 0-.31-3.93l.24-.26q1.54.25 11.33.26h10.68q9 0 11.34-.26Z"/></svg>',
              command: (editor) => {
                editor.chain().focus().setVariant("large").run();
              },
              isActiveTest: (editor) => editor.isActive({ variant: "large" }),
            },
          ],
        },
      ],
    };
  },
  validations() {
    return {
      model: {
        permalink: {
          required,
          maxLength: maxLength(255),
        },
      },
    }
  },
  watch: {
    "model.contentJson"(val) {
      if (Array.isArray(val) 
        && val[0]
        && val[0]["content"]
        && val[0]["type"]
        && val[0]["type"] == "heading"
        && val[0]["content"][0]
        && val[0]["content"][0]["text"]) {
          this.model.permalink = slugify(val[0]["content"][0]["text"], {
            replacement: '-',  // replace spaces with replacement character, defaults to `-`
            remove: undefined, // remove characters that match regex, defaults to `undefined`
            lower: true,      // convert to lower case, defaults to `false`
            strict: false,     // strip special characters except replacement, defaults to `false`
            locale: Trans.currentLocale, // language code of the locale to use
            trim: true         // trim leading and trailing replacement chars, defaults to `true`
          });
      } else {
        this.model.permalink = null;
      }
    }
  },
  computed: {
    getFrontEndUrl() {
      return import.meta.env.VITE_FRONTEND_URL
    },
    isNewPost() {
      return this.$router.currentRoute.value.path == "/posts/create" ? true : false;
    },
    permalinkErrors() {
      const errors = [];
      const field = "permalink";
      if (!this.v$["model"][field].$dirty) return errors;
      this.v$["model"][field].required.$invalid &&
        errors.push(this.$t("v.text.required"));
      this.v$["model"][field].maxLength.$invalid &&
        errors.push(this.$t("v.string.maxLength", { max: "255" }));
      return errors;
    },
  },
  created() {
    this.model.id = this.generateId(this);
  },
  mounted() {
    //
    // Ctrl + S save support
    // 
    document.addEventListener('keydown', e => {
      if (e.ctrlKey && e.key === 's') { // Prevent the Save dialog to open
        e.preventDefault();
        this.save();
      }
    });
  },
  methods: {
    setHtmlContent(contentHtml) {
      this.model.contentHtml = contentHtml;
    },
    menuItemClick(item, key) {
      console.error(`Item clicked: ${item.title}, Index: ${key}`);
    },
    save() {
      console.error(this.model.contentHtml);
    }
  }
}
</script>
