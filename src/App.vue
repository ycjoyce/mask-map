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

		<my-header ref="my-header" />

		<div
			class="main-container"
			:style="{
				height: `calc(100vh - ${headerHeight}px)`
			}"
		>
			<data-panel
				v-show="$store.getters.rwd !== 'mobile' || panelChecked !== 'map-panel'"
				@backToUserPos="backToUserPos = Date.now()"
			/>

			<map-panel
				v-show="$store.getters.rwd !== 'mobile' || panelChecked === 'map-panel'"
				:all-pharmacy-data="$store.state.maskData"
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
import { FETCH_MASK_DATA } from '@/types';
import { SET_CUR_PAGE, GET_WINDOW_WIDTH, REFRESH_LIST } from '@/types';
import { pages } from '@/util';

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
			headerHeight: 0,
			showMaskRuleModal: false,
			panelChecked: 'data-panel',
			reRenderMap: false,
			backToUserPos: null,
		};
	},
	methods: {
		getElData() {
			this.headerHeight = this.$refs['my-header']['$el'].offsetHeight;
			this.$store.dispatch(
				'pageActions',
				{ type: GET_WINDOW_WIDTH, payload: window.innerWidth }
			);
		},
		fetchMaskData() {
			const { dispatch, state } = this.$store;

			dispatch(
				'maskActions',
				{ type: FETCH_MASK_DATA }
			);

			if (state.refreshList.time) {
				return;
			}
			
			dispatch(
				'maskActions',
				{
					type: REFRESH_LIST,
					payload: { click: false, time: Date.now() }
				}
			);
		},
		toggleMaskRuleModal(status) {
			this.showMaskRuleModal = status;
			if (!status) {
				this.$store.dispatch(
					'pageActions',
					{ type: SET_CUR_PAGE, payload: 'index' }
				);
			}
		},
		onPageChange(page) {
			const [index, openModal] = Object.keys(pages);
			switch (page) {
				case index:
					this.$store.commit('setCheckedPharmacy', null);
					break;
				case openModal:
					this.toggleMaskRuleModal(true);
					break;
				default:
					break;
			}
		},
	},
	watch: {
		'$store.state.refreshList': function({ click, time }) {
			if (!click || !time) {
				return;
			}
			this.fetchMaskData();
		},
		'$store.state.checkedPharmacy': function(val) {
			if (!val) {
				this.panelChecked = 'data-panel';
				return;
			}
			this.panelChecked = 'map-panel';
			this.reRenderMap = true;
		},
		'$store.state.curPage': function(page) {
			this.onPageChange(page);
		},
	},
	created() {
		this.fetchMaskData();
	},
	mounted() {
		this.getElData();
		window.addEventListener('resize', this.getElData);
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.getElData);
	},
};
</script>

<style lang="scss">
	@import '@/styles/all.scss';
</style>
