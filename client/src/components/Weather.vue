<template>
  <div class="map-container">
    <iframe
      src="https://www.meteoalarm.org/en/live/"
      class="meteoalarm-map"
      frameborder="0"
      allowfullscreen
      loading="lazy"
    ></iframe>
  </div>
</template>

<script>
export default {
  name: 'MeteoalarmMap'
}
</script>

<style scoped>
.map-container {
  position: relative;
  overflow: hidden;
  height: 40vh;
}

.meteoalarm-map {
  width: 100%;
  height: calc(103vh + 60px);
  border: none;
  margin-top: -80px;
  border-radius: 1.5rem;
}
</style>
