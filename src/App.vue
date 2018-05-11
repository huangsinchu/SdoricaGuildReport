<template>
  <div id="app">
    <img style="margin: 5px" src="./assets/sdorica.png">
    <div style="height: calc(100vh - 130px)">
      <router-view/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  line-height: 0;
}
</style>
