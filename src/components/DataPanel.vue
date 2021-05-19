<template>
  <aside>
    <search-bar/>

    <available-cal/>

    <data-detail/>

    <pharmacy-card/>

    <button class="btn btn-solid-pmr btn-circle">
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
}
</script>
