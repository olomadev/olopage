
import slugify from 'slugify';
import copyToClipboard from 'clipboard-copy';
import config from "@/_config"
import { getFrontendUrl, getApiUrl } from "@/utils"

/**
 * Common methods for editor page
 */
export default {
  data() {
    return {
      menuItems: [
        { title: 'Duplicate', value: 'duplicate', show: true },
        { title: 'Copy Link', value: 'copy-link', show: true },
        { title: 'Edit Permalink', value: 'edit-permalink', show: true },
        { title: 'Delete', value: 'delete', show: true },
      ],
    }
  },
  created() {
    const Self = this
    document.addEventListener('keydown', function(e) { // Ctrl + S save support
      if (e.ctrlKey && e.key === 's') { // Prevent the Save dialog to open
        e.preventDefault();
        Self.$nextTick(() => {  // Access After DOM Rendering
          if (Self.$refs.saveButton && Self.$refs.saveButton.$el) {
            Self.$refs.saveButton.$el.click();
          }
        });
      }
    });
  },
  computed: {
    getMenuItems() {
      const updatedMenuItems = this.menuItems.map(item => {
        if (item.value === 'delete' && !this.previewable) {
          return { ...item, show: false };
        }
        if (item.value === 'duplicate' && !this.previewable) {
          return { ...item, show: false };
        }
        return item;
      });
      return updatedMenuItems;
    },
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
    getFrontendBaseUrl() {
      return getFrontendUrl()
    },
    getFeaturedImageUrl() {
      if (this.model?.featuredImageId['name']) {
        return getApiUrl('/files/display?fileName=' + this.model.featuredImageId.name)  
      }
      return null
    },
  },
  methods: {
    showMessage(type, text) {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      let tolerance = this.smAndDown ? 500 : 0;
      if (this.smAndDown) {
        tolerance = 500
      }
      if (!this.smAndDown && scrollPosition == 0) {
        tolerance = 0
      } else {
        tolerance = 100
      }
      // console.error("scrollPosition: " + scrollPosition)
      // console.error("windowHeight: " + windowHeight)
      // console.error("tolerance: " + tolerance)
      // console.error("documentHeight: " + documentHeight)
      let userIsAtBottom = false
      if (Math.ceil(scrollPosition + windowHeight + tolerance) > documentHeight) {
        userIsAtBottom = true
      } else {
        userIsAtBottom = false
      }
      this.message.text = text;
      this.message.type = type;
      this.message.top = userIsAtBottom ? false : true;
      this.message.bottom = userIsAtBottom ? true : false;
      setTimeout(() => { this.message.top = false; this.message.bottom = false; }, 3000);
    },
    setPermalink(url) {
      if (Object.prototype.toString.call(url) === "[object String]") {
        return slugify(url, {
          replacement: config.slugify.replacement,  // replace spaces with replacement character, defaults to `-`
          remove: config.slugify.remove, // remove characters that match regex, defaults to `undefined`
          lower: config.slugify.lower,      // convert to lower case, defaults to `false`
          strict: config.slugify.strict,     // strip special characters except replacement, defaults to `false`
          locale: config.slugify.locale, // language code of the locale to use
          trim: config.slugify.trim, // trim leading and trailing replacement chars, defaults to `true`
        });
      }
    },
    setHtmlContent(html) {
      this.model.contentHtml = html;
    },
    async menuItemClick(item, key) {
      const Self = this
      if (key === 'duplicate') {
        this.$router.push({ path: "/posts/create", query: { source: this.model.id }})
      }
      if (key === 'edit-permalink') this.editPermalinkDialog = true;
      if (key === 'copy-link') {
        copyToClipboard(getFrontendUrl(this.model.permalink))
        this.showMessage("info", this.$t("resources.posts.messages.postUrlCopiedSuccessfully"))
      }
      if (key === 'delete') {
        const res = await this.$admin.http({ method: "DELETE", url: "/posts/delete/" + this.model.id });
        if (res && res.status === 200) {
          setTimeout(function(){
            Self.$admin.message("success", Self.$t("resources.posts.messages.postDeletedSuccessfully"));
          }, 200);
          Self.$router.push({ name: 'posts_list' })
        }
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
      const message = this.model.publishStatus === 'published' ? this.$t("resources.posts.messages.postPublished") : this.$t("resources.posts.messages.postUnpublished")
      this.showMessage("info", message)
      this.loadingPublish = false
    },
  },
};
