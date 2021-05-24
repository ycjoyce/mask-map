<template>
  <aside class="data-panel">
    <modal
      v-show="ruleModal"
      @closeModal="toggleRuleModal"
    >
      <img
        :src="require('@/assets/img/available_rule.jpeg')"
      >
    </modal>

    <search-bar/>

    <available-cal
      @openRuleModal="toggleRuleModal"
    />

    <data-detail
      :range="dataDetailRange"
    />

    <pharmacy-card
      v-for="pharmacy in pharmacyToShow"
      :key="pharmacy.properties.id"
      :pharmacy-data="pharmacy"
    />

    <button
      class="btn btn-solid-pmr corner-round-lg title-ttr box-sdw load-more-data"
      @click="showMore"
      :disabled="showMoreDisabled"
    >
      查看更多
    </button>
  </aside>
</template>

<script>
import Modal from '@/components/Modal.vue';
import SearchBar from '@/components/SearchBar.vue';
import AvailableCal from '@/components/AvailableCal.vue';
import DataDetail from '@/components/DataDetail.vue';
import PharmacyCard from '@/components/PharmacyCard.vue';
import calDistance from '@/assets/js/calDistance';

export default {
  mixins: [calDistance],
	components: {
    Modal,
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
      pharmacyShowedAmt: 20,
      ruleModal: false,
      pharmacyToShow: [],
      pharmacyFiltered: [],
      pharmacySorted: [],
      dataDetailRange: '',
      range: 5,
    };
  },
  computed: {
    showMoreDisabled() {
      if (!this.pharmacyFiltered || !this.allPharmacyData || this.pharmacyToShow.length === 0) {
        return true;
      }
      let allData = this.pharmacyFiltered.length > 0 ? this.pharmacyFiltered : this.allPharmacyData;
      return this.pharmacyToShow.length >= allData.length;
    },
  },
  methods: {
    toggleRuleModal(status) {
      this.ruleModal = status;
    },
    async initPharmacyToShow() {
      await this.sortArrByDis(this.allPharmacyData).then((res) => {
        this.pharmacyFiltered = res.filter((item) => (
          this.calDistance(item.geometry.coordinates) <= this.range
        ));
        return res;
      }).then((res) => {
        if (this.pharmacyFiltered.length < 1) {
          this.dataDetailRange = '';
          this.pharmacyToShow = res.slice(0, this.pharmacyShowedAmt);
        } else {
          this.pharmacyToShow = this.pharmacyFiltered.slice(0, this.pharmacyShowedAmt);
        }
      });
    },
    async sortArrByDis(arr) {
      let result = JSON.parse(JSON.stringify(arr));
      result = arr.sort((a, b) => {
        let disA = +this.calDistance(a.geometry.coordinates);
        let disB = +this.calDistance(b.geometry.coordinates)
        return disA - disB;
      });
      this.pharmacySorted = result;
      return result;
    },
    showMore() {
      let allData = this.pharmacyFiltered.length > 0 ? this.pharmacyFiltered : this.allPharmacyData;
      this.pharmacyToShow = allData.slice(
        0,
        this.pharmacyToShow.length + this.pharmacyShowedAmt
      );
    },
  },
  watch: {
    '$store.state.userCurPos': function(val, oldVal) {
      if (!oldVal && val) {
        this.initPharmacyToShow();
      }
    },
  },
  created() {
    this.dataDetailRange = `距離附近 ${this.range}公里 以內`;
  },
}
</script>
