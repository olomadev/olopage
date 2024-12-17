<template>
	<v-app>
     <!-- @slot Top app bar region, ideal place for VAppBar. -->
     <slot name="appbar"></slot>
     
     <v-main>
      <div class="d-flex flex-column fill-height">     
          <header>
          	<slot name="header"></slot>	
          </header>
          
          <va-messages></va-messages>

          <v-container fluid class="flex mb-10">
	          <!-- New Vue 3 code -->
            <div style="margin-bottom: 80px;">
              <router-view v-slot="{ Component }"></router-view>
            </div>
          </v-container>

          <footer>
            <slot name="footer"></slot>
          </footer>
      </div>
     </v-main>

    <!-- @slot Right aside region, where you can put anything you need. -->
    <slot name="aside"></slot>
  </v-app>
</template>

<script>
/**
 * Admin composable component layout with one slot for each region.
 */
export default {};
</script>

<style>
.v-main {
  background-color: #fafafa;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>