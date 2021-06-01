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
      @chooseLocation="chooseLocation"
      :disabled="disabled"
      :filteredData="filteredByInput"
    />

    <available-cal
      @openRuleModal="toggleRuleModal"
    />

    <data-detail
      :range="dataDetailRange"
      :disabled="disabled"
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
      disabled: true,
      searchCondition: null,
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
    async getAllFiltered(val) {
      let keys = [];

      let allFiltered = this.townMap.filter((location) => {
        let exist = {};
        for (let key in location) {
          keys.push(key);
          exist[key] = val.includes(location[key]) || location[key].includes(val);
        }
        let { county, town, cunli } = exist;

        return county || town || cunli;
      });

      return {
        val,
        allFiltered,
        keys,
      };
    },
    async filteredReduce({ val, allFiltered, keys }) {
      let filteredReduce = {};

      for (let key of keys) {
        filteredReduce[key] = allFiltered.filter((location) => (
          val.includes(location[key]) || location[key].includes(val)
        )).reduce((a, e) => {
          if (!a.find((item) => item[key] === e[key])) {
            let el = {
              county: e.county,
            };
            if (key === 'town' || key === 'cunli') {
              el.town = e.town;
            }
            if (key === 'cunli') {
              el.cunli = e.cunli;
            }
            a.push(el);
          }
          return a;
        }, []);
      }

      return filteredReduce;
    },
    async handleInputVal({ val, el }) {
      if (!val) {
        this.filteredByInput.splice(0);
        el.focus();
        return;
      }
      
      let filteredData = await this.getAllFiltered(val);
      let filteredReduce = await this.filteredReduce(filteredData);

      let result = [];

      for (let res in filteredReduce) {
        result = result.concat(filteredReduce[res]);
      }

      this.filteredByInput = result;
      el.focus();
    },
    initTownMap(data) {
      this.townMap = data.map((pharmacy) => {
        let county = pharmacy.properties.county;
        let town = pharmacy.properties.town;
        let cunli = pharmacy.properties.cunli;
        return { county, town, cunli };
      }).filter(({ county, town, cunli }) => (
        county || town || cunli
      ));
    },
    chooseLocation({ location, input }) {
      this.filteredByInput.splice(0);
      let word = '';
      this.searchCondition = { location, input };

      if (!location) {
        this.pharmacyFiltered = this.pharmacySorted.filter((pharmacy) => {
          let keys = ['county', 'town', 'cunli'];
          let exist = {};
          for (let key of keys) {
            exist[key] = pharmacy.properties[key] &&
                        (pharmacy.properties[key].includes(input) ||
                        input.includes(pharmacy.properties[key]));
          }
          return exist.county || exist.town || exist.cunli;
        });
        word = `「${input}」`;
      } else {
        this.pharmacyFiltered = this.pharmacySorted.filter((pharmacy) => {
          let condition = true;
          for (let key in location) {
            if (!{}.hasOwnProperty.call(location, key)) {
              continue;
            }
            if (key) {
              condition = condition && pharmacy.properties[key] === location[key];
            }
          }
          return condition;
        });
        for (let key in location) {
          word += location[key];        
        }
      }

      this.pharmacyToShow = this.pharmacyFiltered.slice(0, this.pharmacyShowedAmt);

      if (this.pharmacyToShow.length < 1) {
        word = `查無「${word}」`;
      }
      this.dataDetailRange = word;      
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
    '$store.state.mapMounted': function(val, oldVal) {
      if (!oldVal && val) {
        this.disabled = false;
      }
    },
    '$store.state.refreshListTime': async function({ click }) {
      if (!click) {
        return;
      }

      await this.initPharmacyToShow();

      if (this.searchCondition) {
        this.chooseLocation(this.searchCondition);
      }
    },
  },
  created() {
    this.dataDetailRange = `距離附近 ${this.range}公里 以內`;
  },
}
</script>
