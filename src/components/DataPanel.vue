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

    <search-bar
      @inputVal="handleInputVal"
      :disabled="!!!townMap"
    />

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
      townMap: null,
      filteredByInput: [],
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
    handleInputVal(val) {
      if (!val) {
        return;
      }

      let filteredCounty = this.townMap.filter((item) => (
        val.includes(item.county) || item.county.includes(val)
      )).map((item) => ({ county: item.county }));
      let filteredTown = [];
      let filteredCunli = [];

      this.townMap.forEach((item) => {
        item.towns.forEach((town) => {
          if (val.includes(town.town) || town.town.includes(val)) {
            filteredTown.push({
              county: item.county,
              town: town.town,
            });
          }

          town.cunli.forEach((cunli) => {
            if (val.includes(cunli) || cunli.includes(val)) {
              filteredCunli.push({
                county: item.county,
                town: town.town,
                cunli,
              });
            }
          });
        });
      });

      let allFiltered = filteredCounty.concat(filteredTown);
      allFiltered = allFiltered.concat(filteredCunli);

      this.filteredByInput = allFiltered;
    },
    initTownMap(data) {
      let result = data.reduce((a, e) => {
        let targetCounty = e.properties.county;
        let exist = a.find((item) => item.county === targetCounty);

        if (!exist && targetCounty) {
          a.push({
            county: targetCounty,
          });
        }

        return a;
      }, []).map((item) => {
        let towns = data.filter((pharmacy) => (
          pharmacy.properties.county === item.county
        )).reduce((a, e) => {
          if (!a.find((el) => el.town === e.properties.town)) {
            a.push({
              town: e.properties.town,
            });
          }
          return a;
        }, []).map((town) => {
          let cunli = data.filter((pharmacy) => (
            pharmacy.properties.town === town.town &&
            pharmacy.properties.county === item.county
          )).map((pharmacy) => (
            pharmacy.properties.cunli
          )).reduce((a, e) => {
            if (!a.includes(e)) {
              a.push(e);
            }
            return a;
          }, []);
          town.cunli = cunli;
          return town;
        });

        item.towns = towns;
        return item;
      });

      this.townMap = result;
    },
  },
  watch: {
    '$store.state.userCurPos': function(val, oldVal) {
      if (!oldVal && val) {
        this.initPharmacyToShow();
      }
    },
    allPharmacyData(val, oldVal) {
      if (!oldVal && val) {
        this.initTownMap(val);
      }
    },
    filteredByInput(val) {
      console.log(val);
    },
  },
  created() {
    this.dataDetailRange = `距離附近 ${this.range}公里 以內`;
  },
}
</script>
