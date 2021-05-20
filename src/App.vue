<template>
  <div>
		<my-header ref="my-header"/>

		<div
			class="main-container"
			:style="{
				height: `calc(100vh - ${headerHeight}px)`
			}"
		>
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
			headerHeight: 0,
		};
	},
	methods: {
		getHeaderHeight() {
			const headerEl = this.$refs['my-header']['$el'];
			return headerEl.offsetHeight;
		},
		fetchDataFromApi() {
			fetchData(
				process.env.VUE_APP_API_ADDRESS
			).then((res) => {
				this.allPharmacyData = res.features;

				if (this.$store.state.refreshListTime.time) {
					return;
				}

				this.$store.commit('refreshList', { 
					click: false,
					time: Date.now()
				});
			});
		},
	},
	watch: {
		'$store.state.refreshListTime': function({ click, time }) {
			if (!click || !time) {
				return;
			}

			this.fetchDataFromApi();
		},
	},
	created() {
		this.fetchDataFromApi();
	},
	mounted() {
		this.headerHeight = this.getHeaderHeight();
	},
}
</script>

<style lang="scss">
	@import '@/assets/scss/all.scss';
</style>