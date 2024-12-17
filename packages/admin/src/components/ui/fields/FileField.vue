<template>
  <div v-if="list">
    <ul v-if="activeFiles.length" class="mb-2">
      <li v-for="(file, i) in activeFiles" :key="i">
        <span>
          <v-btn v-if="clearable" icon @click="clear(file[itemValue])">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-chip
            color="gray"
            x-small
            @click="clickToOpen($event, i)"
          >
            {{ getFileProp(file, fileName) }}
          </v-chip>
        </span>
      </li>
    </ul>
  </div>
  <div v-else>
    <div v-if="activeFiles.length" class="mb-2">
      <span v-for="(file, i) in activeFiles" :key="i">
        <v-btn v-if="clearable" icon @click="clear(file[itemValue])">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-chip
          color="gray"
          x-small
          @click="clickToOpen($event, i)"
        >
          {{ getFileProp(file, fileName) }}
        </v-chip>
      </span>
    </div> 
  </div>
</template>

<script>
import Files from "../../../mixins/files";

/**
 * Show a list of file links that point to original files.
 */
export default {
  mixins: [Files],
  props: {
    /**
     * Enable list show
     */
    list: {
      type: Boolean,
      default() {
        return false
      },
    },
    /**
     * Set tablename
     */
    tableName: String,
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
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { }
.file-item {
  display: flex;
  align-items: center;
    margin: 0;
  padding: 0;
}
</style>
