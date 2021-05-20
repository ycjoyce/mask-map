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
	},
});

export default store;