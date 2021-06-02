import Vue from 'vue';
import Vuex from 'vuex';

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
		windowWidth: window.innerWidth,
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
		getWindowWidth(state, width) {
			state.windowWidth = width;
		},
	},
});

export default store;