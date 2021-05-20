<template>
  <div id="map" class="map">
    
  </div>
</template>

<script>
import L from 'leaflet';

export default {
  data() {
    return {
      map: null,
    };
  },
  mounted() {
    this.map = L.map('map', {
      center: [51.505, -0.09],
      zoom: 13,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
  },
}
</script>

<style lang="scss">
  @import '~leaflet/dist/leaflet.css';
</style>