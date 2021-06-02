<template>
  <div>
		<modal
			class="mask-rule-modal"
			v-show="showMaskRuleModal"
			@closeModal="toggleMaskRuleModal(false)"
		>
			<img
				:src="require('@/assets/img/mask_rule.jpeg')"
				class="mask-rule-img"
			>

			<a
				href="https://emask.taiwan.gov.tw/msk/index.jsp"
				target="_blank"
				class="btn btn-solid-white text-color-pmr corner-round-lg"
			>
				立即線上預購
			</a>
			
			<a
				href="https://www.nhi.gov.tw/Content_List.aspx?n=F834AD6472551F9A"
				target="_blank"
				class="btn btn-border-white text-color-white corner-round-lg"
			>
				下次可購買日試算
			</a>
		</modal>

		<my-header
			ref="my-header"
			@openMaskRuleModal="toggleMaskRuleModal(true)"
			@backToDataPanel="backToDataPanel"
			:curPage="curPage"
		/>

		<div
			class="main-container"
			:style="{
				height: `calc(100vh - ${headerHeight}px)`
			}"
		>
			<data-panel
				:all-pharmacy-data="allPharmacyData"
				@backToUserPos="backToUserPos = Date.now()"
				v-show="$store.getters.rwd !== 'mobile' || panelChecked !== 'map-panel'"
			/>

			<map-panel
				:all-pharmacy-data="allPharmacyData"
				:reRender="reRenderMap"
				:backToUserPos="backToUserPos"
				v-show="$store.getters.rwd !== 'mobile' || panelChecked === 'map-panel'"
			/>
		</div>
	</div>
</template>

<script>
import Modal from '@/components/Modal.vue';
import MyHeader from '@/components/MyHeader.vue';
import DataPanel from '@/components/DataPanel.vue';
import MapPanel from '@/components/MapPanel.vue';
import fetchData from '@/assets/js/fetch';

export default {
	name: 'App',
	components: {
		Modal,
		MyHeader,
		DataPanel,
		MapPanel,
	},
	data() {
		return {
			allPharmacyData: null,
			headerHeight: 0,
			showMaskRuleModal: false,
			curPage: '口罩供給現況',
			panelChecked: 'data-panel',
			reRenderMap: false,
			backToUserPos: null,
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
		toggleMaskRuleModal(status) {
			this.showMaskRuleModal = status;
			this.curPage = status ? '口罩怎麼買' : '口罩供給現況';
		},
		getWindowWidth() {
			this.$store.commit('getWindowWidth', window.innerWidth);
		},
		backToDataPanel() {
			this.$store.commit('setCheckedPharmacy', null);
		},
	},
	watch: {
		'$store.state.refreshListTime': function({ click, time }) {
			if (!click || !time) {
				return;
			}

			this.fetchDataFromApi();
		},
		'$store.state.checkedPharmacy': function(val) {
			if (!val) {
				this.panelChecked = 'data-panel';
				return;
			}
			this.panelChecked = 'map-panel';
			this.reRenderMap = true;
		},
	},
	created() {
		this.fetchDataFromApi();
	},
	mounted() {
		this.headerHeight = this.getHeaderHeight();
		window.addEventListener('resize', this.getWindowWidth);
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.getWindowWidth);
	},
}
</script>

<style lang="scss">
	@import '@/assets/scss/all.scss';
</style>