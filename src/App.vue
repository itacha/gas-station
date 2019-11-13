<template>
  <transition name="fade">
    <router-view></router-view>
  </transition>
</template>

<script>
  export default {
  }
</script>
<style>
@font-face {
    font-family: 'Receiver-Regular';
    src:url('./assets/font/Receiver-Regular.otf');
    font-weight: normal;
    font-style: normal;
}
@font-face {
    font-family: 'UnidreamLED';
    src:url('./assets/font/UnidreamLED.ttf'),
    url('./assets/font/UnidreamLED.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
}
</style>
