<template>
  <aside class="data-panel">
    <search-bar/>

    <available-cal/>

    <data-detail/>

    <pharmacy-card
      v-for="pharmacy in pharmacyToShow"
      :key="pharmacy.properties.id"
      :pharmacy-data="pharmacy"
    />

    <button class="btn btn-solid-pmr corner-round-lg title-ttr box-sdw load-more-data">
      查看更多
    </button>
  </aside>
</template>

<script>
import SearchBar from '@/components/SearchBar.vue';
import AvailableCal from '@/components/AvailableCal.vue';
import DataDetail from '@/components/DataDetail.vue';
import PharmacyCard from '@/components/PharmacyCard.vue';

export default {
	components: {
    SearchBar,
    AvailableCal,
    DataDetail,
    PharmacyCard,
  },
  props: {
    allPharmacyData: {
      type: Array,
      required: false,
    },
  },
  data() {
    return {
      pharmacyStartIdx: 0,
      pharmcyShowedAmt: 20,
    };
  },
  computed: {
    pharmacyToShow() {
      if (!this.allPharmacyData) {
        return [];
      }
      return this.allPharmacyData.slice(this.pharmacyStartIdx, this.pharmacyStartIdx + this.pharmcyShowedAmt);
    },
  },
}
</script>
