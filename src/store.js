import Vue from 'vue';
import Vuex from 'vuex';
import mask from '@/apis/mask';
import {
	FETCH_MASK_DATA,
	SET_CUR_PAGE,
	GET_WINDOW_WIDTH,
	REFRESH_LIST,
} from '@/types';
import { pages } from '@/util';

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		mapCenter: [25.0457377, 121.5129428],
		checkedPharmacy: null,
		mapMounted: false,
		windowWidth: null,
		//-----
		maskData: null,
		refreshList: { click: null, time: null },
		curPage: 'index',
		userCurPos: [25.0457377, 121.5129428], // temp
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
		refreshList(state, data) {
			state.refreshList = { ...state.refreshList, ...data };
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
				case REFRESH_LIST:
					commit('refreshList', { click: true, ...action.payload });
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