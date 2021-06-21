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
			:cur-page="curPage"
			:nav-targets="Object.values(navTargets)"
			@changeCurPage="handleChangePage"
		/>

		<div
			class="main-container"
			:style="{
				height: `calc(100vh - ${headerHeight}px)`
			}"
		>
			<data-panel
				v-show="$store.getters.rwd !== 'mobile' || panelChecked !== 'map-panel'"
				:all-pharmacy-data="allPharmacyData"
				@backToUserPos="backToUserPos = Date.now()"
			/>

			<map-panel
				v-show="$store.getters.rwd !== 'mobile' || panelChecked === 'map-panel'"
				:all-pharmacy-data="allPharmacyData"
				:re-render="reRenderMap"
				:back-to-user-pos="backToUserPos"
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
			curPage: '',
			panelChecked: 'data-panel',
			reRenderMap: false,
			backToUserPos: null,
			navTargets: {
				index: '口罩供給現況',
				openModal: '口罩怎麼買',
			},
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
					time: Date.now(),
				});
			});
		},
		toggleMaskRuleModal(status) {
			this.showMaskRuleModal = status;
			if (!status) {
				this.curPage = this.navTargets.index;
			}
		},
		getWindowWidth() {
			this.headerHeight = this.getHeaderHeight();
			this.$store.commit('getWindowWidth', window.innerWidth);
		},
		handleChangePage(page) {
			const targetKey = Object.keys(this.navTargets).find((key) => this.navTargets[key] === page);
			if (!targetKey) {
				return;
			}
			if (targetKey === 'openModal') {
				this.toggleMaskRuleModal(true)
			} else if (targetKey === 'index') {
				this.$store.commit('setCheckedPharmacy', null);
			}
			this.curPage = this.navTargets[targetKey];
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
		this.curPage = this.navTargets.index;
	},
	mounted() {
		this.getWindowWidth();
		window.addEventListener('resize', this.getWindowWidth);
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.getWindowWidth);
	},
};
</script>

<style lang="scss">
	@import '@/assets/scss/all.scss';
</style>
