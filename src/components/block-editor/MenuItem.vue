<template>
  <div class="group text-sm relative">
    <slot></slot>
    <div
      v-if="hasDropdown"
      :class="getClass"
    >
      <slot name="dropdown"></slot>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    getClass() {
      let classStr = "bg-white shadow py-2 group-focus-within:block hidden overflow-hidden whitespace-nowrap absolute bottom-full mt-4 border border-slate-400";
      classStr += this.align == 'left' ? 'left-0' : 'right-0';
      if (this.rec.top < 420) {
        classStr += " sm:bottom-auto sm:top-full"; // show dropdown menu at the top position
      } 
      return classStr
    },
    hasDropdown() {
      return !!this.$slots.dropdown;
    },
  },
  watch: {
    coords(val) {
      this.rec.top = val.top; // set client rect object menu top position
    },
  },
  data() {
    return {
      rec: {
        top: null,
      }
    }
  },
  props: {
    coords: {
      type: Object,
      default: null,
    },
    align: {
      type: String,
      default: "left",
    },
    iconName: {
      type: String,
      required: false,
    },
    iconSvg: {
      type: String,
      required: false,
    },
    label: {
      type: String,
      required: false,
    },
    activeClass: {
      type: String,
      required: false,
      default: "!bg-slate-600 hover:!bg-slate-700 !text-white rounded",
    },
    active: {
      type: Boolean,
    },
  },
};
</script>
