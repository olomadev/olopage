<template>
  <v-row v-if="activeFiles.length" class="mb-2">
    <v-col
      v-for="(file, i) in activeFiles"
      :key="i"
      class="d-flex child-flex"
      :lg="lg"
      cols="4"
    >
      <v-img
        :src="getBase64Image(file)"
        aspect-ratio="1"
        cover
        class="bg-grey-lighten-2"
        style="cursor: pointer;"
        @click="clickToOpen($event, i)"
      >
        <template v-slot:placeholder>
          <v-row
            class="fill-height ma-0"
            align="center"
            justify="center"
          >
            <v-progress-circular
              indeterminate
              color="grey-lighten-5"
            ></v-progress-circular>
          </v-row>
        </template>
      </v-img>
    </v-col>
  </v-row>
</template>

<script>
import Files from "../../../mixins/files";

/**
 * Show list of images as gallery with preview support for thumbnails.
 */
export default {
  mixins: [Files],
  props: {
    /**
     * Set tablename
     */
    tableName: String,
    /**
     * Resizes the background image to cover the entire container.
     */
    cover: Boolean,
    /**
     * Max height of image.
     */
    height: String,
    /**
     * Max column width for image gallery.
     */
    lg: [String, Number],
    /**
     * Read file or download action
     */
    actionType: {
      type: String,
      default() {
        return "download"
      },
    },
  },
  methods: {
    getBase64Image(file) {
      return file.data;
    },
    clickToOpen(e, index){
      if (this.actionType == "download") {
        this.downloadFileWithIndex(index)
      } else {
        this.readFileWithIndex(index)
      }
      e.stopPropagation();
    },
    readFileWithIndex(index) {
      let url = this.$admin.apiUrl + this.$admin.readFileUrl + String(this.value[index].id) + '?tableName=' + this.tableName
      this.testFile(url, this.value[index].id)
    },
    downloadFileWithIndex(index) {
      let url = this.$admin.apiUrl + this.$admin.downloadUrl + String(this.value[index].id) + '?tableName=' + this.tableName
      this.testFile(url, this.value[index].id)
    },
    async testFile(url, fileId) {
      let response = null
      try {
        response = await this.$admin.http.get(url)
        if (response.status == 200 && typeof fileId != "undefined") {
          location.href = url
        }
      } catch (e) {
        console.log(e)
        this.$store.getModule("messages").show({ type: 'warning', message: this.$t("error.fileNotFound") });  
      }
    },
  }
};
</script>

<style scoped>
.v-card .v-image__image {
  transition: opacity 0.4s ease-in-out;
}
.v-card.on-hover .v-image__image {
  opacity: 0.2;
}
.show-btns {
  color: rgba(0, 0, 0, 1) !important;
}
</style>
