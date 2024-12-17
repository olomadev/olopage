import { defineStore } from "pinia";

const guest = defineStore('guest', {
    state: () => {
      return { }
    },
    getters: {
      getId() {
        return null;
      },
      getFullname() {
        return null;
      },
      getEmail() {
        return null;
      },
      getAvatar() {
        return null;
      },
      getPermissions() {
        return [];
      },
    },
    actions: {
      checkAuth() { return Promise.resolve(true) },
      checkError() {},
    }, 
  }
);

export default guest;