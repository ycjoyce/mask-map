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
	SET_USER_POS,
} from '@/types';

const defaultPos = {
	name: '台北車站',
	coords: [25.0457377, 121.5129428],
};

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
			showMaskRuleModal: false,
			panelShowed: 'data',
			curPage: 'index',
		};
	},
	methods: {
		setVh() {
			const vh = window.innerHeight * 0.01;
			document.documentElement.style.setProperty("--vh", `${vh}px`);
		},
		getElData() {
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
		getUserPos() {
			const successGPS = (position) => {
				const { coords: { latitude, longitude } } = position;
				this.setUserPos([latitude, longitude]);
			};

			const errorGPS = () => {
				const { name, coords } = defaultPos;
				this.toggleModal(`無法判斷您的所在位置，預設地點將為 ${name}`);
				this.setUserPos(coords);
			};

			if (!navigator.geolocation) {
				this.toggleModal('您的裝置不具備GPS，無法使用此功能');
				return;
			}

			navigator.geolocation.getCurrentPosition(successGPS, errorGPS);
		},
		setUserPos(coords) {
			this.$store.dispatch('mapActions', { type: SET_USER_POS, payload: coords });
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

			if (val) {
				this.$store.dispatch('mapActions', {
					type: SET_MAP_RENDERED,
					payload: Date.now(),
				});
				this.panelShowed = 'map';
			}
		},
		'$store.state.maskData': function(val, oldVal) {
			if (!oldVal && val) {
				this.getUserPos();
			}
		},
	},
	created() {
		this.$store.dispatch(
			'maskActions',
			{ type: REFRESH_LIST, payload: Date.now() }
		);
	},
	mounted() {
		this.getElData();
		this.setVh();
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
