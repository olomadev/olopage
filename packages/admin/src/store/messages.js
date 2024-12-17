import { defineStore } from "pinia";
import config from "@/_config";

const messages = defineStore('messages', {
  state: () => {
    return { 
      apiErrors: false,
      confirmObject: null,
      resolve: null,
      reject: null,
      editDialog: false,
      editResolve: null,
      editReject: null,
      snackbar: {
        class: null,
        color: null,
        icon: null,
        location: "top",
        variant: null,
        rounded: 0,
        text: null,
        timeout: 7500,
        title: null,
        visible: false
      }
    }
  },
  getters: {
    getSnackbar(state) {
      return state.snackbar;
    },
    getConfirmObject(state) {
      return state.confirmObject;
    },
    getHideApiErrors(state) {
      return state.apiErrors;
    },
  },
  actions: {
    hideApiErrors(status) {
      this.apiErrors = status;
    },
    showConfirm(state, { title, message }) {
      this.confirmObject = { title, message };
    },
    hideConfirm(state) {
      this.confirmObject = null;
    },
    setResolve(state, resolve) {
      this.resolve = resolve;
    },
    setReject(state, reject) {
      this.reject = reject;
    },
    cleanError() {
      this.error = null;
    },
    cleanSnackbar() {
      this.snackbar = {
        class: null,
        color: null,
        icon: null,
        location: "top",
        variant: null,
        rounded: 0,
        text: null,
        timeout: 7500,
        title: null,
        visible: false
      }
    },
    show({ type, message }) {
      if (!type || !config.snackbar[type]) {
        return;
      }
      this.snackbar = {
        class: config.snackbar[type].class,
        color: config.snackbar[type].color,
        icon: config.snackbar[type].icon,
        location: config.snackbar[type].location,
        variant: config.snackbar[type].variant,
        rounded: config.snackbar[type].rounded,
        timeout: config.snackbar[type].timeout,
        title: config.snackbar[type].title,
        text: message,
        visible: config.snackbar[type].visible 
      };
    },
    confirm({ title, message }) {
      this.confirmObject = { title, message };
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      })
    },
    agree() {
      this.resolve(true);
      this.confirmObject = null;
    },
    cancel() {
      this.resolve(false);
      this.confirmObject = null;
    },
    openUnsavedEditDialog() {
      this.editDialog = true;
      return new Promise((resolve, reject) => {
        this.editResolve = resolve;
        this.editReject = reject;
      });
    },
    closeUnsavedEditDialog() {
      this.editDialog = false;
    },
    agreeUnsavedEditDialog() {
      this.editResolve(true);
      this.editDialog = false;
    },
    cancelUnsavedEditDialog() {
      this.editResolve(false);
      this.editDialog = false;
    },
  }
});

export default messages;