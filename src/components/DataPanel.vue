<template>
  <aside class="data-panel">
    <modal
      v-show="ruleModal"
      @closeModal="ruleModal = false"
    >
      <img :src="require('@/assets/img/available_rule.jpeg')" />
    </modal>

    <search-bar
      :disabled="disabled"
      @onSubmit="onSearchSubmit"
    />

    <available-cal
      @openRuleModal="ruleModal = true"
    />

    <data-detail
      :range="dataDetailRange"
      :disabled="disabled"
    />

    <pharmacy-card
      v-for="pharmacy in pharmaciesToShow.slice(0, pharmacyShowedAmt)"
      :key="pharmacy.properties.id"
      :pharmacy-data="pharmacy"
    />
    
    <button
      class="btn btn-solid-pmr corner-round-lg title-ttr box-sdw load-more-data"
      :disabled="showMoreDisabled"
      @click="pharmacyShowedAmt += 20"
    >
      查看更多
    </button>

    <button
      v-show="$store.getters.rwd !== 'mobile'"
      class="btn btn-solid-white corner-circle box-sdw locate-cur-pos"
      @click="backToUserPos"
    ></button>
  </aside>
</template>

<script>
import Modal from '@/components/Modal.vue';
import SearchBar from '@/components/SearchBar.vue';
import AvailableCal from '@/components/AvailableCal.vue';
import DataDetail from '@/components/DataDetail.vue';
import PharmacyCard from '@/components/PharmacyCard.vue';
import calDistance from '@/mixins/calDistance';
import { BACKTO_USER_POS } from '@/types';

export default {
  mixins: [calDistance],
	components: {
    Modal,
    SearchBar,
    AvailableCal,
    DataDetail,
    PharmacyCard,
  },
  data() {
    return {
      ruleModal: false,
      allPharmacyData: [],
      pharmaciesToShow: [],
      pharmacyShowedAmt: 20,
      dataDetailRange: '',
      range: 5,
      townMap: null,
      filteredByInput: [],
      disabled: true,
      searchCondition: null,
    };
  },
  computed: {
    showMoreDisabled() {
      const listLength = this.pharmaciesToShow.length;
      return !this.allPharmacyData || this.pharmacyShowedAmt > listLength;
    },
  },
  methods: {
    toggleRuleModal(status) {
      this.ruleModal = status;
    },
    initPharmaciesToShow() {
      const filteredPharmacies = this.filterPharmaciesByDist();
      
      if (filteredPharmacies.length < 1) {
        this.dataDetailRange = '';
        this.pharmaciesToShow = this.allPharmacyData;
      } else {
        this.pharmaciesToShow = filteredPharmacies;
      }
    },
    filterPharmaciesByDist(pharmacies = this.allPharmacyData, range = this.range) {
      return pharmacies.filter((pharmacy) => (
        pharmacy.distance <= range
      ));
    },
    async sortPharmaciesByDist(arr) {
      return arr.map((item) => (
        { ...item, distance: this.calDistance(item.geometry.coordinates) }
      )).sort((a, b) => (
        a.distance - b.distance
      ));
    },
    filterPharmaciesBySearch(location) {
      const filteredPharmacies = this.allPharmacyData.filter((pharmacy) => {
        const { properties: { county, town, cunli, address } } = pharmacy;
        const addressGroup = [county, town, cunli, address].join('');
        return addressGroup.includes(location);
      });
      this.pharmaciesToShow = filteredPharmacies;
    },
    onSearchSubmit(location) {
      this.filterPharmaciesBySearch(location);
      this.dataDetailRange = `「${location}」`;
    },
    backToUserPos() {
      this.$store.dispatch('mapActions', { type: BACKTO_USER_POS });
    },
  },
  watch: {
    '$store.state.maskData': async function(val, oldVal) {
      if (!oldVal && val) {
        this.allPharmacyData = await this.sortPharmaciesByDist(val);
      }
    },
    '$store.state.mapRendered': function(val, oldVal) {
      if (!oldVal && val) {
        this.disabled = false;
        this.initPharmaciesToShow();
      }
    },
    '$store.state.refreshListTime': async function() {
      this.allPharmacyData = await this.sortPharmaciesByDist(this.$store.state.maskData);
      this.initPharmaciesToShow();
    },
  },
  created() {
    this.dataDetailRange = `距離附近 ${this.range}公里 以內`;
  },
};
</script>
