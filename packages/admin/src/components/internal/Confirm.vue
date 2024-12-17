<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title class="display-0">
        {{ title }}
      </v-card-title>
      <v-card-text>
        {{ message }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="red darken-1"
          text
          @click.native="agree"
        >
          {{ $t("va.confirm.yes") }}
        </v-btn>
        <v-btn
          color="green darken-1"
          text
          @click.native="cancel"
        >
          {{ $t("va.confirm.no") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  // setup() {
  //   //
  //   // https://runthatline.com/pinia-watch-state-getters-inside-vue-components/
  //   // 
  //   // console.error(confirmObject);
  // },
  data: () => ({
    dialog: false,
    confirm: null,
    title: null,
    message: null,
  }),
  computed: {
    dialog: {
      get() {
        const confirmObject = this.$store.getModule("messages").confirmObject;
        if (confirmObject) {
          this.title = confirmObject.title;
          this.message = confirmObject.message;
        }
        return confirmObject;
      },
      set(bool) {
        this.cancel();
        return bool;
      },
    },
  },
  methods: {
    agree() {
      this.$store.getModule('messages').agree()
    },
    cancel() {
      this.$store.getModule('messages').cancel();
    },
  }
};
</script>
