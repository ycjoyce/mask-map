<template>
  <div
    id="map"
    class="map"
  ></div>
</template>

<script>
import L from 'leaflet';
import { getDistance } from '@/assets/js/util';

export default {
  props: {
		allPharmacyData: {
      type: Array,
      required: false,
    },
	},
  data() {
    return {
      center: this.$store.state.mapCenter,
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
      let curPos = [
        position.coords.latitude,
        position.coords.longitude,
      ];
      this.center = curPos;
      this.$store.commit('setUserCurPos', curPos);

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
        if (point.coords[0] > 100) {
          [point.coords[0], point.coords[1]] = [point.coords[1], point.coords[0]];
        }
      });

      this.points = this.points.filter((point) => (
        getDistance(point.coords, this.center) <= this.distanceArange
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
    center(val) {
      this.$store.commit('setMapCenter', val);
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