<template>
  <div id="map" class="map"></div>
</template>

<script>
import L from 'leaflet';
import { getDistance } from '@/util';
import getAvailableStatus from '@/mixins/getAvailableStatus';
import calDistance from '@/mixins/calDistance';
import {
  SET_USER_POS,
  SET_MAP_RENDERED,
  SET_MAP_CENTER,
  SET_PHARMACY_CHECKED
} from '@/types';

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
    defaultPos: {
      type: Object,
      required: true,
    },
	},
  data() {
    return {
      map: null,
      markers: [],
    };
  },
  computed: {
    center() {
      return this.$store.state.mapCenter;
    },
    allPoints() {
      return this.allPharmacyData.map((pharmacy) => {
        const { properties, geometry: { coordinates: coords } } = pharmacy;
        if (coords[0] > 100) {
          [coords[0], coords[1]] = [coords[1], coords[0]];
        }
        return { properties, coords };
      });
    },
  },
  methods: {
    toggleModal(msg, ableToClose = false) {
      this.$emit('setMapMsg', { msg, ableToClose });
    },
    getUserPos() {
      const successGPS = (position) => {
        const { coords: { latitude, longitude } } = position;
        this.setUserPos([latitude, longitude]);
        this.initMap();
      };

      const errorGPS = () => {
        const { name, coords } = this.defaultPos;
        this.toggleModal(`無法判斷您的所在位置，預設地點將為 ${name}`);
        this.setUserPos(coords);
        this.initMap();
      };

      if (!navigator.geolocation) {
        this.toggleModal('您的裝置不具備GPS，無法使用此功能');
        return;
      }

      navigator.geolocation.getCurrentPosition(successGPS, errorGPS);
    },
    setUserPos(coords) {
      this.$store.dispatch('mapActions', { type: SET_MAP_CENTER, payload: coords });
      this.$store.dispatch('mapActions', { type: SET_USER_POS, payload: coords });
    },
    initMap() {
      this.map = L.map('map', { center: this.center, zoom: 15 });
      L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      ).addTo(this.map);
      this.map.on('moveend', this.onMapMove);

      this.drawMarkers(this.filterPointsByDist());
      
      this.$store.dispatch(
        'mapActions',
        { type: SET_MAP_RENDERED, payload: Date.now() }
      );
    },
    async onMapMove() {
      const { lat, lng } = this.map.getCenter();
      const [storeLat, storeLng] = this.$store.state.mapCenter;
      if (lat === storeLat && lng === storeLng) {
        return;
      }

      this.$store.dispatch('mapActions', { type: SET_MAP_CENTER, payload: [lat, lng] });
      const markers = await this.drawMarkers(this.filterPointsByDist());
      const checkedPharmacyId = this.$store.state.checkedPharmacy;

      if (checkedPharmacyId) {
        const targetMarker = markers.find(({ _pharmacyId }) => (
          _pharmacyId === checkedPharmacyId
        ));
        targetMarker.openPopup();
        this.$store.dispatch('mapActions', { type: SET_PHARMACY_CHECKED, payload: false });
      }
    },
    filterPointsByDist(center = this.center, range = 5) {
      return this.allPoints.filter((point) => (
        getDistance(point.coords, center) <= range
      ));
    },
    drawMarkers(points) {
      return new Promise((resolve) => {
        const renderMarkers = points.map((point) => this.renderMarker(point));
        Promise.allSettled(renderMarkers).then((res) => {
          res.forEach(({ status, value: marker }, idx, arr) => {
            if (
              status === 'fulfilled' &&
              !this.markers.find((m) => m._pharmacyId === marker._pharmacyId)
            ) {
              this.markers = [...this.markers, marker];
            }
            if (idx === arr.length - 1) {
              resolve(this.markers);
            }
          });
        });
      });
    },
    getPointStatus({ properties }) {
      const start = Date.now();
      let time = null;
      return new Promise((resolve, reject) => {
        let status = this.availableStatus(properties);
        while (!status) {
          status = this.availableStatus(properties);
          time = Date.now();
          if (time - start > 500) {
            reject(`Get point status time out : ${properties.name}`);
            break;
          }
        }
        resolve(status);
      });
    },
    async renderMarker(point) {
      let successGetStatus = { status: true };
      const pointStatus = await this.getPointStatus(point).catch((e) => {
        console.error(e);
        successGetStatus = { status: false, msg: e };
      });
      if (!successGetStatus.status) {
        return Promise.reject(successGetStatus.msg);
      }

      const customIcon = L.icon({
        iconUrl: require(`@/assets/img/ic_point_${pointStatus}.png`),
        iconSize: [30, 30],
      });
      const popup = L.popup({
        className: 'map-popup'
      }).setContent(
        this.renderMarkerBox(pointStatus, point)
      );

      const marker = L.marker(point.coords, {
        icon: customIcon,
        opacity: 1,
      }).addTo(this.map).bindPopup(popup);
      marker._name = point.properties.name;
      marker._pharmacyId = point.properties.id;
      marker.on('click', (e) => {
        const { lat, lng } = e.latlng;
        this.map.flyTo([lat, lng]);
      });

      return marker;
    },
    renderMarkerBox(status, point) {
      const ageTypes = { adult: '成人', child: '兒童' };
      const maskAmt = Object.keys(ageTypes).reduce((a, e) => {
        return a + point.properties[`mask_${e}`];
      }, 0);
      let template = this.markerBoxTitleTemplate(status, point);

      Object.entries(ageTypes).forEach((type) => {
        template += this.markerBoxAmtTemplate({ type, maskAmt, point });
      });
      template += '</div>';

      return template;
    },
    markerBoxTitleTemplate(status, { properties: { name }, coords }) {
      return `
        <div class="pharmacy-title ${status}">
          <p class="text-color-pmr text-bold title-ttr">
            ${name}
          </p>
          <span class="text-color-pmr text-bold text-sm">
            ${this.calDistance(coords)} km
          </span>
          <span class="text-sm text-bg-${status} corner-round-sm pharmacy-status">
            ${this.availableStatusMap[status]}
          </span>
        </div>
        <div class="amt-box-container">
      `;
    },
    markerBoxAmtTemplate({ type: [key, val], maskAmt, point: { properties } }) {
      return `
        <div
          class="amt-box amt-box-${this.maskStatus(maskAmt, properties[`mask_${key}`])} corner-round-sm"
        >
          <p class="amt-box-title">
            ${val}
          </p>
          <p class="amt-box-amt text-sm">
            <span class="amt-box-num text-bold title-ttr">
              ${properties['mask_' + key]}
            </span>
            片
          </p>
        </div>
      `;
    },
  },
  watch: {
    allPharmacyData(val, oldVal) {
      if (!oldVal && val) {
        this.getUserPos();
      }
    },
    '$store.state.checkedPharmacy': function(id) {
      if (!id) {
        return;
      }
      const { coords } = this.allPoints.find(({ properties }) => properties.id === id);
      this.map.flyTo(coords);
    },
    '$store.state.mapCenter': function(coords) {
      const [lat, lng] = coords;
      const [userLat, userLng] = this.$store.state.userPos;
      if (lat === userLat && lng === userLng) {
        this.map.flyTo(coords);
      }
    },
    '$store.state.mapRendered': function(time, oldTime) {
      if (!oldTime && time) {
        return;
      } 
      this.map.invalidateSize();
    },
  },
  created() {
    this.toggleModal('地圖資料讀取中請稍候');
  },
};
</script>

<style lang="scss">
  @import '~leaflet/dist/leaflet.css';
</style>
