import Vue from 'vue';
import Vuex from 'vuex';
import mask from '@/apis/mask';
import { FETCH_MASK_DATA, SET_CUR_PAGE } from '@/types';
import { pages } from '@/util';

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		refreshListTime: {
			click: null,
			time: null,
		},
		mapCenter: [25.0457377,121.5129428],
		userCurPos: null,
		checkedPharmacy: null,
		mapMounted: false,
		windowWidth: null,
		//-----
		maskData: null,
		curPage: 'index',
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
		refreshList(state, data) {
			state.refreshListTime = data;
		},
		setMapCenter(state, coords) {
			state.mapCenter = coords;
		},
		setUserCurPos(state, coords) {
			state.userCurPos = coords;
		},
		setCheckedPharmacy(state, id) {
			state.checkedPharmacy = id;
		},
		setMapMounted(state) {
			state.mapMounted = true;
		},
		//------
		getWindowWidth(state, width) {
			state.windowWidth = width;
		},
		fetchMaskData(state, data) {
			state.maskData = data;
		},
		setCurPage(state, page) {
			if (!Object.keys(pages).includes(page)) {
				throw new Error('Unvalid page');
			}
			state.curPage = page;
		},
	},
	actions: {
		maskActions({ commit }, action) {
			const fetchMaskData = async () => {
				const { data: { features } } = await mask.get();
				commit('fetchMaskData', features);
			};

			switch (action.type) {
				case FETCH_MASK_DATA:
					fetchMaskData();
					break;
				default:
					break;
			}
		},
		pageActions({ commit }, action) {
			switch (action.type) {
				case SET_CUR_PAGE:
					commit('setCurPage', action.payload);
					break;
				default:
					break;
			}
		},
	},
});

export default store;