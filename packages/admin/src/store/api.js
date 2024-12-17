import { defineStore } from "pinia"
import * as methods from "../providers/data/actions"
import useStore from "@/store"

let storeActions = {};
Object.values(methods).forEach((action) => {
  storeActions[action] = ({ resource, params }) => {
    const store = useStore();
    const method = action.charAt(0).toUpperCase() + action.slice(1);
    return store.getModule(resource)[method](params, { root: true });
  }
});
/**
 * Be careful when adding methods here. 
 * If you change some method names of variables accidentally, 
 * the application may not work properly.
 */
const api = defineStore('api', {
  state: () => {
    return { 
      fields: null,
      headers: null,
      saved: false,
      status: false,
      loading: false,
      refresh: false,
      rowForm: null,
      filterValues: null,
    }
  },
  getters: {
    getHeaders() {
      return this.headers;
    },
    getFields() {
      return this.fields
    },
    getLoading() {
      return this.loading
    },
    getFilterValues() {
      return this.filterValues
    },
    getFormSaved() {
      return this.saved
    },
    getFormStatus() {
      return this.status
    },
    getRowForm() {
      return this.rowForm;
    },
  },
  actions: {
    ...storeActions,
    setHeaders(headers) {
      this.headers = headers;
    },
    setFields(fields) {
      this.fields = fields;
    },
    setFilterValues(values) {
      this.filterValues = values;
    },
    setFormSaved(saved) {
      this.saved = saved;
    },
    setFormStatus(changed) {
      this.status = changed
    },
    setRowForm(item) {
      this.rowForm = item;
    },
    setLoading(loading) {
      this.loading = loading;
      if (!loading) {
        this.refresh = false;
      }
    },
    setRefresh(refresh) {
      this.refresh = refresh;
    },
  },

});

export default api;