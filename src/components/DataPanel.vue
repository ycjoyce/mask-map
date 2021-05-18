<template>
  <aside>
    <search-bar/>

    <available-cal/>

    <data-detail/>
  </aside>
</template>

<script>
import SearchBar from '@/components/SearchBar.vue';
import AvailableCal from '@/components/AvailableCal.vue';
import DataDetail from '@/components/DataDetail.vue';

export default {
	components: {
    SearchBar,
    AvailableCal,
    DataDetail,
	},
}
</script>
