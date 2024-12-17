import get from "lodash/get"
import camelCase from "lodash/camelCase";
import kebabCase from "lodash/kebabCase";
import upperFirst from "lodash/upperFirst";
import config from "@/_config";

// https://stackoverflow.com/questions/66342500/vuejs-3-how-to-render-router-view-router-view-from-vue-router
// 
import { h, resolveComponent } from 'vue' // vue 3.0 support

export default ({ app, admin, store, i18n, resource, title }) => {
  let { name, include, routes, translatable, getTitle, pluralName } = resource
  let isSameErrors = []

  const setTitle = (to, action, item = null) => {
    to.meta.title = getTitle(action, item);
    /**
     * Set main and document title
     */
    // document.title = `${to.meta.title} | ${title}`;
    return title;
  }
  /**
   * Action route builder
   */
  const buildRoute = (action, path) => {
    return {
      path,
      name: `${name}_${action}`,
      props: true,
      component: {
        props: ["id"],
        render() {
          let componentName = `${upperFirst(camelCase(name))}${upperFirst(
            action
          )}`
          let props = {
            id: this.id,
            title: this.$route.meta.title,
            resource: resource.name,
            item: store.getResource(name).item,
            roles: store.getModule("auth").getPermissions,
          }
          //
          // https://stackoverflow.com/questions/72975779/vuejs-3-see-all-globally-registered-components-this-options-components-is-empt
          // 
          // if (componentName in app._context.components) {
          //   return h(componentName, {
          //     props,
          //   });
          // }
          //
          // vue 3.0
          // 
          if (app.component(componentName)) { // check component is exists
            return h(resolveComponent(componentName), props)  
          } else {
            return h(resolveComponent("PageNotFound")) 
          }
        },
        async beforeRouteEnter(to, from, next) {
          
          /**
           * Initialize from query if available
           */
          let id = to.params.id || to.query.source;

          if (id) {
            /**
             * Route model binding
             */
            try {
              let { data } = await store.getResource(name).getOne({
                id,
                include,
              });
              /**
               * Insert model into route & resource store
               */
              store.getResource(name).setItem(data);
              store.getResource(name).setFormItem(JSON.stringify(data));
              
              if (to.params.id) {
                setTitle(to, action, data);
                return next();
              }
            } catch ({ status, message }) {
              console.log("Error: " + message)
              to.meta.title = "Error";
              document.title = "Error"
              return next();
            }
          }
          setTitle(to, action);
          next();
        },
        async beforeRouteLeave(to, from, next) {

          let strArray = this.$route.name.split("_"); // check the current route is edit
          if (Array.isArray(strArray) && strArray.length > 0) {
              let lastItem = strArray[strArray.length - 1]

              if (lastItem.trim() == "edit") {
                let formSaved = store.getModule("api").getFormSaved; // if form had already saved
                if (formSaved) {
                  store.getModule("api").setFormSaved(false);
                  store.getModule("api").setFormStatus(false);
                  return next()
                }
                let formStateChanged = store.getModule("api").getFormStatus;
                if (formStateChanged && !config.form.disableUnsavedFormDialog) {
                  const confirmResult = await store.getModule("messages").openUnsavedEditDialog();
                  if (confirmResult) {
                    store.getResource(name).removeItem();
                    store.getModule("api").setFormStatus(false);
                    return next();
                  } else {
                    return next(false);
                  }  
                } else {
                  store.getResource(name).removeItem();
                  return next();
                }
              }
          } // end checking edit route 
          store.getResource(name).removeItem();
          return next()
        },
      },
      meta: {
        authenticated: true,
        resource: name,
        translatable
      },
    }
  }

  /**
   * Return crud routes for this resource
   */
  return {
    path: `/${kebabCase(name)}`,
    component: {
      render() {
        return h(resolveComponent('router-view'))
      }
    },
    meta: {
      title: pluralName,
    },
    children: [
      { name: "list", path: "" },
      { name: "create", path: "create" },
      { name: "show", path: ":id" },
      { name: "edit", path: ":id/edit" },
    ]
      .filter(({ name }) => routes.includes(name))
      .map(({ name, path }) => buildRoute(name, path)),
  }
}