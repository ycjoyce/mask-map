<template>
  <div
    id="map"
    class="map"
  ></div>
</template>

<script>
import L from 'leaflet';
import { getDistance } from '@/assets/js/util';
import getAvailableStatus from '@/assets/js/getAvailableStatus';
import calDistance from '@/assets/js/calDistance';

export default {
  mixins: [
    getAvailableStatus,
    calDistance,
  ],
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
      markers: [],
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
      let amtBoxTemplate = (status, point) => {
        let ageTypes = [{'adult': '成人'}, {'child': '兒童'}];
        let amtBoxTemplate = `
          <div class="pharmacy-title ${status}">
            <p class="text-color-pmr text-bold title-ttr">
              ${point.properties.name}
            </p>
            <span class="text-color-pmr text-bold text-sm">
              ${this.calDistance(point.coords)} km
            </span>
            <span class="text-sm text-bg-${status} corner-round-sm pharmacy-status">
              ${this.availableStatusMap[status]}
            </span>
          </div>
          <div class="amt-box-container">
        `;
        let totalMask = 0;

        for (let ageType of ageTypes) {
          let key = Object.keys(ageType)[0];
          let val = Object.values(ageType)[0];
          totalMask += point.properties[`mask_${key}`];

          amtBoxTemplate += `
            <div
              class="amt-box amt-box-${this.maskStatus(totalMask, point.properties[`mask_${key}`])} corner-round-sm"
            >
              <p class="amt-box-title">
                ${val}
              </p>
              <p class="amt-box-amt text-sm">
                <span class="amt-box-num text-bold title-ttr">
                  ${point.properties['mask_' + key]}
                </span>
                片
              </p>
            </div>
          `;
        }
        amtBoxTemplate += '</div>';

        return amtBoxTemplate;
      };
      
      this.points.forEach(async (point) => {
        let timer;
        let getStatus = () => {
          return new Promise((resolve) => {
            timer = setInterval(() => {
              let status = this.availableStatus(point.properties);
              if (status) {
                resolve(status);
              }
            }, 500);
          });
        };

        await getStatus().then((status) => {
          clearInterval(timer);
          
          let customIcon = L.icon({
            iconUrl: require(`@/assets/img/ic_point_${status}.png`),
            iconSize: [30, 30],
          });

          let popup = L.popup({
            className: 'map-popup'
          }).setContent(
            amtBoxTemplate(status, point)
          );
          
          let marker = L.marker(point.coords, {
            icon: customIcon,
            opacity: 1,
          }).addTo(this.map).bindPopup(popup);

          marker._pharmacyId = point.properties.id;

          this.markers.push(marker);

          marker.on('click', (e) => {
            let {lat, lng} = e.latlng;
            let coords = [lat, lng];
            this.map.flyTo(coords);
          });
        });
      });
    },
    async handleMapMove() {
      const {lat, lng} = this.map.getCenter();
      this.center = [lat, lng];

      await this.getPoints().then(() => {
        this.drawMarkers();
      });
    },
    async getTargetLayer(id) {
      return this.markers.find((marker) => marker._pharmacyId === id);
    },
  },
  watch: {
    allPharmacyData(val, oldVal) {
      if (!oldVal && val) {
        this.getUserPos();
      }
    },
    '$store.state.checkedPharmacy': async function(val) {
      let targetPharmacy = this.allPharmacyData.find((pharmacy) => pharmacy.properties.id === val);
      let coords = targetPharmacy.geometry.coordinates;

      if (coords[0] > 100) {
        [coords[0], coords[1]] = [coords[1], coords[0]];
      }

      this.map.flyTo(coords);

      await this.getTargetLayer(val).then((res) => {
        res.openPopup();
      });
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