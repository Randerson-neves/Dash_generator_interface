<template>
  <div id="app">
    <ImportXLSX />
    <router-view />
  </div>
</template>

<script>
import ImportXLSX from './components/ImportXLSX.vue';

export default {
  name: 'App',
  components: {
    ImportXLSX,
  },
};
</script>
