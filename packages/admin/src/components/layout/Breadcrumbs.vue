<template>
  <v-breadcrumbs :items="items"></v-breadcrumbs>
</template>

<script>
/**
 * Default admin component for breadcrumbs, will generate automatically hierarchical links from current route.
 * Support hierarchical CRUD structure.
 */
export default {
  computed: {
    items() {
      let crumbs = []
      let result = this.$route.matched.map((route) => {
        let length = 0;
        let myArray = [];
        if (typeof route.meta.title !== 'undefined') {
            myArray = route.meta.title.split(" ")
            if (route.meta.title.indexOf("#") > 0) {
                myArray.pop()  // remome #id source 
            }
        } else if (route['name']) {
            myArray = route.name.split(" ")
            if (route.name.indexOf("#") > 0) {
                myArray.pop()  // remome #id source 
            }
        }
        let actionArray = "";
        if (myArray.length > 0) {
          let breadCrumb = myArray.join(" ")  
          let item = breadCrumb.toLowerCase()
          crumbs.push(item)
          crumbs.forEach(function(val, index) {
            if (val && val.indexOf("_")) {
              actionArray = val.split("_");
            }
          })
        }
        let text = "";
        if (Array.isArray(actionArray) && actionArray.length > 0) {  // do not repat index list
            text = this.$t("crumbs." + actionArray[actionArray.length - 1]);
        }
        if (route.meta.title && (route.meta.title.indexOf("failed") > 0 || route.meta.title.indexOf("Not found") == 0)) {
            text = ""
        }
        return {
          title: text,
          exact: true,
          to: route.path === "" ? "/" : route.path,
        };
      });
      
      return result
    },
  },
};
</script>
