import Vue from 'vue';
import Vuex from 'vuex';
import mask from '@/apis/mask';
import {
	FETCH_MASK_DATA,
	GET_WINDOW_WIDTH,
	REFRESH_LIST,
	SET_USER_POS,
	SET_MAP_RENDERED,
	SET_PHARMACY_CHECKED,
	SET_MAP_CENTER,
	BACKTO_USER_POS,
} from '@/types';

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		windowWidth: null,
		maskData: null,
		refreshListTime: null,
		userPos: [],
		mapRendered: false,
		checkedPharmacy: null,
		mapCenter: [],
	},
	getters: {
		rwd(state) {
			if (state.windowWidth > 1199) {
				return 'pc';
			}
			if (state.windowWidth > 768 && state.windowWidth < 1200) {
				return 'pad';
			}
			return 'mobile';
		},
	},
	mutations: {
		getWindowWidth(state, width) {
			state.windowWidth = width;
		},
		fetchMaskData(state, data) {
			state.maskData = data;
		},
		refreshList(state, time) {
			state.refreshListTime = time;
		},
		setUserPos(state, coords) {
			state.userPos = coords;
		},
		setMapRendered(state, time) {
			state.mapRendered = time;
		},
		setPharmacyChecked(state, id) {
			state.checkedPharmacy = id;
		},
		setMapCenter(state, coords) {
			state.mapCenter = coords;
		},
	},
	actions: {
		maskActions({ commit }, action) {
			const fetchMaskData = () => {
				let features = null;
				mask.get().then((res) => {
					features = res.data.features;
				}).catch(async () => {
					const { features: res } = await import('@/assets/points.json');
					features = res;
				}).finally(() => {
					commit('fetchMaskData', features);
				});
			};

			switch (action.type) {
				case FETCH_MASK_DATA:
					fetchMaskData();
					break;
				case REFRESH_LIST:
					commit('refreshList', action.payload);
					break;
				default:
					break;
			}
		},
		pageActions({ commit }, action) {
			switch (action.type) {
				case GET_WINDOW_WIDTH:
					commit('getWindowWidth', action.payload);
					break;
				default:
					break;
			}
		},
		mapActions({ commit, state }, action) {
			switch (action.type) {
				case SET_USER_POS:
					commit('setUserPos', action.payload);
					break;
				case SET_MAP_RENDERED:
					commit('setMapRendered', action.payload);
					break;
				case SET_PHARMACY_CHECKED:
					commit('setPharmacyChecked', action.payload);
					break;
				case SET_MAP_CENTER:
					commit('setMapCenter', action.payload);
					break;
				case BACKTO_USER_POS:
					commit('setMapCenter', state.userPos);
					break;
				default:
					break;
			}
		},
	},
});

export default store;