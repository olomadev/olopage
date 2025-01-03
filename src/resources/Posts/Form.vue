<template>
  <v-row no-gutters class="mb-2">
    <v-col cols="12" md="8" lg="9" sm="12">
      <v-card :loading="loading" flat border height="100%" min-height="600" class="d-flex flex-column">
        <v-card-title class="mt-3 d-flex">
          <v-spacer />
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props" />
            </template>
            <v-list elevation="2">
              <v-list-item
                v-for="(item, index) in menuItems"
                :key="index"
                @click="menuItemClick(item, item.value)"
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-card-title>
        <v-card-text>
          <BlockEditor 
            :key="editorKey"
            editorClass="py-2 prose xl:prose-xl text-slate-800 max-w-none"
            v-model="model.contentJson"
            :editable="editable"
            mode="json"
            :blockTools="blockTools"
            :blockWidthTypes="['horizontalRule', 'blockquote', 'youtube']"
            @updateHtmlContent="setHtmlContent"
          />
        </v-card-text>
        <template v-slot:actions>
          <v-row id="posts-permalink-url" align="center" justify="center" v-if="model.permalink">
            <a href="javascript:void(0)">{{ getFrontEndUrl }}{{ model.permalink }}</a>
          </v-row>
        </template>
      </v-card>
    </v-col>
    <v-col cols="12" md="4" lg="3" sm="12">
      <div id="posts-sticky-actions">
        <v-card flat :class="smAndDown ? 'ml-lg-5 ml-md-5 mt-2' : 'ml-lg-5 ml-md-5'" border>
          <v-card-text>
            <v-row no-gutters class="mb-2">
              <v-col cols="12">
                <v-btn :loading="loadingPublish" block flat :prepend-icon="publishStatusIcon" :color="publishStatusColor" @click.stop="togglePublish">
                  {{ publishStatusText }}
                </v-btn>
              </v-col>
            </v-row>
            <v-row no-gutters class="mb-2" v-if="previewable">
              <v-col cols="12">
                <v-btn block flat prepend-icon="mdi-eye-outline">Preview</v-btn>
              </v-col>
            </v-row>
            <v-row no-gutters class="mb-2">
              <v-col cols="12">
                <v-btn ref="saveButton" block flat prepend-icon="mdi-content-save" color="secondary" @click.stop="save">
                  {{ $t('va.actions.save') }}
                </v-btn>
              </v-col>
            </v-row>
            <v-row no-gutters class="mt-5" v-if="previewable">
              <v-col cols="6">
                <va-date-input variant="filled" v-model="model.publishDate" source="publishDate" label="Published on" format="shortFormat" />
              </v-col>
              <v-col cols="6">
                <va-text-input variant="filled" v-model="model.publishTime" source="publishTime" class="ml-5 maska" v-maska="'##:##'" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-card flat :class="smAndDown ? 'mt-5 ml-lg-5 ml-md-5 mt-2' : 'mt-5 ml-lg-5 ml-md-5'" border :subtitle="$t('resources.posts.categories')">
          <v-card-text>
            <v-row no-gutters>
              <v-col cols="12">  
                <va-select-input
                  density="compact"
                  v-model="model.categories"
                  resource="posts"
                  reference="categories"
                  :filter="{ visibility: 'public' }"
                  variant="filled"
                  multiple
                  chips
                  closable-chips
                >
                </va-select-input>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-card flat :class="smAndDown ? 'mt-5 ml-lg-5 ml-md-5 mt-2' : 'mt-5 ml-lg-5 ml-md-5'" border :subtitle="$t('resources.posts.tags')">
          <v-card-text>
            <v-row no-gutters>
              <v-col cols="12">  
                <va-auto-complete-input
                  density="compact"
                  v-model="model.tags"
                  resource="posts"
                  reference="tags"
                  variant="filled"
                  multiple
                  chips
                  taggable
                  closable-chips
                >
                </va-auto-complete-input>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </div>
    </v-col>
  </v-row>
  <v-dialog v-model="editPermalinkDialog" width="auto" :fullscreen="smAndDown">
    <v-card :min-width="dialogWidth">
      <v-card-title class="text-h5">{{ $t('resources.posts.permalink-dialog-title') }}</v-card-title>
      <v-card-text>
        <v-text-field density="compact" :prefix="getFrontEndUrl" v-model="model.permalink" />
      </v-card-text>
      <v-card-actions>
        <v-btn class="ms-auto" text @click="editPermalinkDialog = false">{{ $t('va.actions.save') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { provide } from 'vue';
import { useDisplay } from 'vuetify';
import BlockEditor from '@/components/block-editor/BlockEditor.vue';
import Utils from 'olobase-admin/src/mixins/utils';
import slugify from 'slugify';
import Trans from "@/i18n/translation";
import { vMaska } from 'maska/vue';
import { formatDate } from "@/_utils";
import copyToClipboard from 'clipboard-copy';

export default {
  props: ['id', 'item'],
  mixins: [Utils],
  directives: { maska: vMaska },
  components: { BlockEditor },
  setup() {
    const { smAndDown } = useDisplay();
    return { smAndDown };
  },
  created() {
    const Self = this
    this.model.id = this.generateId(this);
    this.previewable = this.$router.currentRoute.value.path === "/posts/create" ? false : true;
    document.addEventListener('keydown', function(e) { // Ctrl + S save support
      if (e.ctrlKey && e.key === 's') { // Prevent the Save dialog to open
        e.preventDefault();
        Self.$nextTick(() => {  // Access After DOM Rendering
          if (Self.$refs.saveButton && Self.$refs.saveButton.$el) {
            Self.$refs.saveButton.$el.click();
          }
        });
      }
    })
  },
  mounted() {
    if (this.item) {
      this.model.tags = this.item.tags;
      this.model.categories = this.item.categories;
      this.model.contentJson = this.item.contentJson;
      this.model.contentHtml = this.item.contentHtml;
      this.model.publishStatus = this.item.publishStatus;
      this.model.publishedAt = this.item.publishedAt;
      if (this.item.publishedAt && typeof this.item.publishedAt === "string") {
        const [datePart, timePart] = this.item.publishedAt.split(' ');  
        this.model.publishDate = datePart;
        this.model.publishTime = timePart;
      }
      ++this.editorKey;
    }
  },
  data() {
    return {
      loading: false,
      loadingPublish: false,
      editPermalinkDialog: false,
      editorKey: 0,
      menuItems: [
        { title: 'Duplicate', value: 'duplicate' },
        { title: 'Copy Link', value: 'copy-link' },
        { title: 'Edit Permalink', value: 'edit-permalink' },
        { title: 'Delete', value: 'delete' },
      ],
      draftId: null,
      editable: true,
      previewable: false,
      model: {
        id: null,
        title: null,
        permalink: null,
        categories: [],
        contentJson: [
          {
            "type": "heading", "attrs": {"textAlign": "left", "level": 1 },
            "content": [ { "type": "text", "text": "Type your title here .." } ]
          },
        ],
        contentHtml: null,
        tags: null,
        publishStatus: "draft",
        publishedAt: null,
        publishDate: null,
        publishTime: null,
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
  watch: {
    "model.permalink"(val) {
      if (this.editPermalinkDialog) {
        this.model.permalink = this.setPermalink(val)
      }
    },
    "model.contentJson"(val) {
      if (
        Array.isArray(val) &&
        val[0]?.content &&
        val[0]?.type === "heading" &&
        val[0]?.content[0]?.text
      ) {
        const text = val[0].content[0].text;
        this.model.title = text;
        this.model.permalink = this.item ? this.item.permalink : this.setPermalink(text)    
      } else {
        this.model.permalink = null;
      }
    }
  },
  computed: {
    dialogWidth() {
      return this.smAndDown ? 300 : 600;
    },
    publishStatusIcon() {
      return this.model.publishStatus === 'published' ? 'mdi-publish-off' : 'mdi-publish';
    },
    publishStatusColor() {
      return this.model.publishStatus === 'published' ? 'red-darken-2' : null;
    },
    publishStatusText() {
      return this.model.publishStatus === 'published' ? this.$t('resources.posts.unpublish') : this.$t('resources.posts.publish');
    },
    getFrontEndUrl() {
      return import.meta.env.VITE_FRONTEND_URL + '/';
    },
  },
  methods: {
    setPermalink(url) {
      if (Object.prototype.toString.call(url) === "[object String]") {
        return slugify(url, {
          replacement: '-',  // replace spaces with replacement character, defaults to `-`
          remove: undefined, // remove characters that match regex, defaults to `undefined`
          lower: true,      // convert to lower case, defaults to `false`
          strict: false,     // strip special characters except replacement, defaults to `false`
          locale: Trans.currentLocale, // language code of the locale to use
          trim: true         // trim leading and trailing replacement chars, defaults to `true`
        });
      }
    },
    setHtmlContent(html) {
      this.model.contentHtml = html;
    },
    menuItemIsVisible(key) {
      if (key != 'delete') {
        return true
      }
      return this.previewable
    },
    async menuItemClick(item, key) {
      const Self = this
      if (key === 'duplicate') {
        this.$router.push({ path: "/posts/create", query: { source: this.model.id }})
      }
      if (key === 'edit-permalink') this.editPermalinkDialog = true;
      if (key === 'copy-link') {
        copyToClipboard(import.meta.env.VITE_FRONTEND_URL + '/' + this.model.permalink)
        this.$admin.message("info", this.$t("resources.posts.messages.postUrlCopiedSuccessfully"));
      }
      if (key === 'delete' && this.previewable) {
        const res = await this.$admin.http({ method: "DELETE", url: "/posts/delete/" + this.model.id });
        if (res && res.status === 200) {
          setTimeout(function(){
            Self.$admin.message("success", Self.$t("resources.posts.messages.postDeletedSuccessfully"));
          }, 200);
          Self.$router.push({ name: 'posts_list' })
        }
      } else if (key === 'delete' && !this.previewable) {
        Self.$router.push({ name: 'posts_list' })
      }
    },
    async togglePublish() {
      this.loadingPublish = "primary"
      this.model.publishStatus = this.model.publishStatus === 'published' ? 'draft' : 'published';
      await this.$admin.http(
        { 
          method: "PATCH", 
          url: "/posts/publish/" + this.model.id, 
          params: { publishStatus: this.model.publishStatus, publishedAt: this.model.publishedAt }
        }
      );
      this.loadingPublish = false
    },
    async save() {
      const Self = this;
      this.loading = false
      if (this.model.contentHtml === '<p></p><p></p>') {
        Self.$admin.message('warning', this.$t("resources.posts.messages.postEmptyContentError"));
        return;
      }
      if (!this.model.permalink) {
        Self.$admin.message('warning', this.$t("resources.posts.messages.postHeadingError"));
        return;
      }
      this.loading = "primary";
      let response = null;
      if (! this.previewable && this.draftId != this.model.id) { // check record exists
        try {
          await this.$admin.http({ method: "GET", url: `/posts/findOneById/${this.model.id}` }).then(function(res) {
            if (res 
                && res?.data?.data?.publishedAt 
                && res.data.data.publishedAt
                && typeof res.data.data.publishedAt === "string") {
                const [datePart, timePart] = res.data.data.publishedAt.split(' ');
                Self.model.publishedAt = res.data.data.publishedAt;
                Self.model.publishedDate = datePart;
                Self.model.publishedTime = timePart;  
            }
          });
          await this.update();
        } catch (error) {
          if (error.status == 404) {
            await this.create();
            this.draftId = this.model.id; // save as draft
          }
          this.loading = false;
        }
      } else {
        await this.update();
      }
      this.loading = false;
    },
    async create() {
      try {
        this.model.publishedAt = formatDate("Y-m-d H:i:s")
        this.model.publishDate = formatDate("Y-m-d")
        this.model.publishTime = formatDate("H:i")
        const res = await this.$admin.http({ method: "POST", url: "/posts/create", data: this.model });
        if (res && res.status === 200) {
          this.previewable = true;
          this.model.permalink = res?.data?.data['permalink'] ? res?.data?.data['permalink'] : this.model.permalink;
          this.$admin.message("success", this.$t("resources.posts.messages.postCreatedSuccessfully"));
        }
      } catch (error) {
        console.error("Create error:", error);
      }
    },
    async update() {
      try {
        const res = await this.$admin.http({ method: "PUT", url: `/posts/update/${this.model.id}`, data: this.model });
        if (res && res.status === 200) {
          this.previewable = true;
          this.model.permalink = res?.data?.data['permalink'] ? res?.data?.data['permalink'] : this.model.permalink;
          this.$admin.message("success", this.$t("resources.posts.messages.postUpdatedSuccessfully"));
        }
      } catch (error) {
        console.error("Update error:", error);
      }
    }
  },
};
</script>

<style>
#posts-sticky-actions {
  position: sticky; top: 0;
}
#posts-permalink-url {
  padding-bottom: 45px;
}
#posts-permalink-url a {
  text-decoration: underline;
  font-size: 14px;
  color:gray;
}
</style>