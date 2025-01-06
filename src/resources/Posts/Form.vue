<template>
  <v-row no-gutters class="mb-2 blockeditor-form">    
    <v-col cols="12" md="8" lg="9" sm="12">
      <v-card :loading="loading" flat border height="100%" min-height="600" class="d-flex flex-column">
        <v-card-title class="mt-3 d-flex">
          <v-alert v-if="message.top" density="compact"  class="alerts" :text="message.text" :type="message.type" :icon="false" variant="tonal" />
          <v-spacer />
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props" />
            </template>
            <v-list elevation="2">
              <template v-for="(item, index) in getMenuItems">
                <v-list-item
                  v-if="item.show"
                  :key="index"
                  @click="menuItemClick(item, item.value)"
                >
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </template>
            </v-list>
          </v-menu>
        </v-card-title>
        <v-card-text>
          <BlockEditor 
            :key="editorKey"
            :admin="this.$admin"
            :postId="this.model.id"
            editorClass="py-2 prose xl:prose-xl text-slate-800 max-w-none"
            v-model="model.contentJson"
            :editable="editable"
            mode="json"
            :blockTools="blockTools"
            :blockWidthTypes="['horizontalRule', 'blockquote', 'youtube']"
            @updateHtmlContent="setHtmlContent"
          />
        </v-card-text>
        <template #actions>
          <v-row class="d-flex">
            <v-col cols="6" class="pl-5">
              <v-alert v-if="message.bottom" density="compact" max-height="30" class="alerts" :text="message.text" :type="message.type" :icon="false" variant="tonal" />
            </v-col>
            <v-col cols="6" class="pr-5" id="posts-permalink-url" align="right" justify="right" v-if="model.permalink">
              <a href="javascript:void(0)">{{ getFrontendBaseUrl }}/{{ model.permalink }}</a>
            </v-col>
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
                <va-tree-view-input :key="newCategoryKey" open-all density="compact" v-model:selected="model.categories" reference="categories" selectable :filter="{ nested: 1 }" />
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="12">
                <v-btn flat :prepend-icon="showNewCategory ? 'mdi-menu-up' : 'mdi-menu-down'"@click.stop="toggleCategory" >
                  {{ $t("resources.posts.newCategory") }}
                </v-btn>
              </v-col>
            </v-row>
            <v-expand-transition>
              <v-sheet class="mt-2" v-if="showNewCategory">
              <v-card flat>
                <v-card-text>
                  <v-row class="mt-2">
                    <va-text-input resource="posts" v-model="newCategory.name" variant="outlined" clearable :error-messages="newCategoryNameErrors" />
                  </v-row>
                  <v-row class="mt-2">
                    <va-select-input :key="newCategoryKey" resource="posts" v-model="newCategory.parentId" reference="categories" variant="outlined" clearable :error-messages="newCategoryParentIdErrors" />
                  </v-row>
                  <v-row class="mt-2">
                    <v-btn :loading="loadingCategory" flat @click.stop="addNewCategory">{{ $t("va.actions.add") }}</v-btn>
                  </v-row>
                </v-card-text>
              </v-card>
              </v-sheet>
            </v-expand-transition>
          </v-card-text>
        </v-card>
        <v-card flat :class="smAndDown ? 'mt-5 ml-lg-5 ml-md-5 mt-2' : 'mt-5 ml-lg-5 ml-md-5'" border :subtitle="$t('resources.posts.tags')">
          <v-card-text>
            <v-row no-gutters>
              <v-col cols="12">  
                <va-auto-complete-input density="compact" v-model="model.tags" resource="posts" reference="tags" variant="filled" multiple chips taggable closable-chips />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-card flat :class="smAndDown ? 'mt-5 ml-lg-5 ml-md-5 mt-2' : 'mt-5 ml-lg-5 ml-md-5'" border :subtitle="$t('resources.posts.featuredImage')">
          <v-card-text>
            <v-row no-gutters>
              <v-col cols="12">
                <v-img rounded class="mb-2" v-if="model.featuredImageId" width="80" height="55" :src="getFeaturedImageUrl" />
                <va-select-input density="compact" v-model="model.featuredImageId" resource="posts" reference="featured-images" variant="filled" closable-chips clearable :filter="{ postId: model.id }" />
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
        <v-text-field density="compact" :prefix="getFrontendBaseUrl + '/'" v-model="model.permalink" />
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
import { vMaska } from 'maska/vue';
import Posts from "@/mixins/posts";
import { formatDate, blockTools } from "@/utils";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

export default {
  props: ['id', 'item'],
  mixins: [Utils, Posts],
  directives: { maska: vMaska },
  components: { BlockEditor },
  setup() {
    const { smAndDown } = useDisplay();
    provide('v$', useVuelidate() )
    return { v$: useVuelidate(), smAndDown }
  },
  created() {
    const Self = this
    this.model.id = this.generateId(this);
    this.previewable = this.$router.currentRoute.value.path === "/posts/create" ? false : true;
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
      loadingCategory: false,
      editPermalinkDialog: false,
      editorKey: 0,
      draftId: null,
      editable: true,
      message: { show: false, type: "error", text: "" },
      previewable: false,
      showNewCategory: false,
      newCategoryKey: 0,
      newCategory: {
        name: null,
        parentId: null,
      },
      model: {
        id: null,
        title: null,
        permalink: null,
        contentJson: [
          {
            "type": "heading", "attrs": {"textAlign": "left", "level": 1 },
            "content": [ { "type": "text", "text": "Type your title here .." } ]
          },
        ],
        contentHtml: null,
        categories: [],
        tags: null,
        featuredImageId: null,
        publishStatus: "draft",
        publishedAt: null,
        publishDate: null,
        publishTime: null,
      },
      blockTools: blockTools(),
    };
  },
  validations() {
    return {
      newCategory: {
        name: { required },   
        parentId: { required }
      }
    }
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
    },
  },
  methods: {
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
          this.showMessage("success", this.$t("resources.posts.messages.postCreatedSuccessfully"))
        }
      } catch (error) {
        console.error("Create error:", error);
      }
    },
    async update() {
      try {
        this.model.publishedAt = this.model.publishDate + ' ' + this.model.publishTime + ':00';
        const res = await this.$admin.http({ method: "PUT", url: `/posts/update/${this.model.id}`, data: this.model });
        if (res && res.status === 200) {
          this.previewable = true;
          this.model.permalink = res?.data?.data['permalink'] ? res?.data?.data['permalink'] : this.model.permalink;
          this.showMessage("success", this.$t("resources.posts.messages.postUpdatedSuccessfully"))
        }
      } catch (error) {
        console.error("Update error:", error);
      }
    },
    async addNewCategory() {
      this.v$.newCategory.name.$touch();
      this.v$.newCategory.parentId.$touch();
      if (this.v$.newCategory.name.$invalid || this.v$.newCategory.parentId.$invalid) {
        return false;
      }
      this.loadingCategory = "primary";
      const data = { id: this.generateUid(), name: this.newCategory.name, parentId: this.newCategory.parentId.id,
        lft: this.newCategory.parentId.lft, rgt: this.newCategory.parentId.rgt };
      await this.$admin.http({ method: "POST", url: "/categories/create", data: data }).then((response) => {
        if (response && response.status == 200) {
          ++this.newCategoryKey;
          this.showNewCategory = false;
          this.showMessage("success", this.$t("resources.posts.messages.newCategoryCreatedSuccessfully"));
        }
      })
      this.loadingCategory = false;
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