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
			@onPageChange="onPageChange"
		/>

		<div
			class="main-container"
			:style="{
				height: `calc(100vh - ${headerHeight}px)`
			}"
		>
			<data-panel
				v-show="$store.getters.rwd !== 'mobile' || panelShowed === 'data'"
			/>

			<map-panel
				v-show="$store.getters.rwd !== 'mobile' || panelShowed === 'map'"
			/>
		</div>
	</div>
</template>

<script>
import Modal from '@/components/Modal.vue';
import MyHeader from '@/components/MyHeader.vue';
import DataPanel from '@/components/DataPanel.vue';
import MapPanel from '@/components/MapPanel.vue';
import { pages } from '@/util';
import {
	FETCH_MASK_DATA,
	GET_WINDOW_WIDTH,
	REFRESH_LIST,
	SET_MAP_RENDERED,
} from '@/types';

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
			panelShowed: 'data',
			curPage: 'index',
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
			this.$store.dispatch(
				'maskActions',
				{ type: FETCH_MASK_DATA }
			);
		},
		toggleMaskRuleModal(status) {
			this.showMaskRuleModal = status;
			if (!status) {
				this.curPage = 'index';
			}
		},
		onPageChange(page) {
			const [index, openModal] = Object.keys(pages);
			this.curPage = page;

			switch (page) {
				case index:
					if (this.$store.getters.rwd === 'mobile') {
						this.panelShowed = 'data';
					}
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
		'$store.state.refreshListTime': function() {
			this.fetchMaskData();
		},
		'$store.getters.rwd': function(rwd) {
			if (rwd === 'mobile') {
				this.panelShowed = 'data';
			}
		},
		'$store.state.checkedPharmacy': function(val) {
			if (this.$store.getters.rwd !== 'mobile') {
				return;
			}
			this.panelShowed = 'map';
			if (!val) {
				return;
			}
			this.$store.dispatch('mapActions', {
				type: SET_MAP_RENDERED,
				payload: Date.now(),
			});
		},
	},
	created() {
		this.fetchMaskData();
		this.$store.dispatch(
			'maskActions',
			{ type: REFRESH_LIST, payload: Date.now() }
		);
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
