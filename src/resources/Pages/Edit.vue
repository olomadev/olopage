<template>
  <va-edit-layout :title="title">
    <pages-form :id="id" :item="item"></pages-form>
  </va-edit-layout>
</template>

<script>
export default {
  props: ["id", "title", "item"],
};
</script>
