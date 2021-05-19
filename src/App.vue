<template>
  <div>
		<my-header/>

		<div>
			<data-panel
				:all-pharmacy-data="allPharmacyData"
			/>

			<map-panel
				:all-pharmacy-data="allPharmacyData"
			/>
		</div>
	</div>
</template>

<script>
import MyHeader from '@/components/MyHeader.vue';
import DataPanel from '@/components/DataPanel.vue';
import MapPanel from '@/components/MapPanel.vue';
import fetchData from '@/assets/js/fetch';

export default {
	name: 'App',
	components: {
		MyHeader,
		DataPanel,
		MapPanel,
	},
	data() {
		return {
			allPharmacyData: null,
		};
	},
	created() {
		fetchData(
			process.env.VUE_APP_API_ADDRESS
		).then((res) => {
			this.allPharmacyData = res.features;
		});
	},
}
</script>

<style lang="scss">
	@import '@/assets/scss/all.scss';
</style>