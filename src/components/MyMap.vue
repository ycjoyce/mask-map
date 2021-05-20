<template>
  <div
    id="map"
    class="map"
  ></div>
</template>

<script>
import L from 'leaflet';

export default {
  props: {
		allPharmacyData: {
      type: Array,
      required: false,
    },
	},
  data() {
    return {
      center: [25.0457377,121.5129428],
      zoom: 15,
      map: null,
      points: [],
      distanceArange: 5,
    };
  },
  methods: {
    getUserPos() {
      if (!navigator.geolocation) {
        this.toggleModal('您的裝置不具備GPS，無法使用此功能');
        return;
      }
      navigator.geolocation.getCurrentPosition(this.successGPS, this.errorGPS);
    },
    successGPS(position) {
      this.center = [
        position.coords.latitude,
        position.coords.longitude,
      ];

      this.initMap();
    },
    errorGPS() {
      this.toggleModal('無法判斷您的所在位置，預設地點將為 台北車站');

      setTimeout(() => {
        this.initMap();
      }, 1000);
    },
    toggleModal(msg, ableToClose = false) {
      this.$emit('getMapMsg', {
        msg,
        ableToClose,
      });
    },
    async initMap() {
      this.map = L.map('map', {
        center: this.center,
        zoom: this.zoom,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
      
      await this.getPoints().then(() => {
        this.drawMarkers();
      }).then(() => {
        this.toggleModal(false);
      });

      this.map.on('moveend', this.handleMapMove);
    },
    async getPoints() {
      this.points = this.allPharmacyData.map((point) => (
        {
          properties: point.properties,
          coords: point.geometry.coordinates
        }
      ));

      this.points.forEach((point) => {
        [point.coords[0], point.coords[1]] = [point.coords[1], point.coords[0]];
      });

      this.points = this.points.filter((point) => (
        this.getDistance(point.coords, this.center) <= this.distanceArange
      ));
    },
    drawMarkers() {
      const customIcon = L.icon({
        iconUrl: require('@/assets/img/ic_point.png'),
        iconSize: [30, 30],
      });

      this.points.forEach((point) => {
        L.marker(point.coords, {
          icon: customIcon,
          opacity: 1,
        }).addTo(this.map);
      });
    },
    getDistance([lat1, lng1], [lat2, lng2]) {
      const radLat1 = lat1 * Math.PI / 180;
      const radLat2 = lat2 * Math.PI / 180;
      const a = radLat1 - radLat2;
      const  b = lng1 * Math.PI / 180 - lng2 * Math.PI / 180;
      let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
              Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
      s = s * 6378.137;
      s = Math.round(s * 10000) / 10000;
      return s;
    },
    async handleMapMove() {
      const {lat, lng} = this.map.getCenter();
      this.center = [lat, lng];

      await this.getPoints().then(() => {
        this.drawMarkers();
      });
    },
  },
  watch: {
    allPharmacyData(val, oldVal) {
      if (!oldVal && val) {
        this.getUserPos();
      }
    },
  },
  mounted() {
    this.toggleModal('地圖資料讀取中請稍候');
  },
}
</script>

<style lang="scss">
  @import '~leaflet/dist/leaflet.css';
</style>