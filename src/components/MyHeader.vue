<template>
	<header class="header">
		<div
			:class="[
				'header-logo-box',
				'logo-box',
				{ active: navOpened && $store.getters.rwd === 'mobile' },
			]"
		>
			<img
				:src="require('@/assets/img/logo.png')"
				alt="口罩即時查"
				class="logo-img"
			>

			<h1 class="logo-title title-sdr text-color-pmr">
				口罩即時查
			</h1>

			<input
				v-show="$store.getters.rwd === 'mobile'"
				type="image"
				:src="navTogglerImg"
				class="nav-toggler btn"
				@click="navOpened = !navOpened"
			>
		</div>

		<navigator
			v-show="$store.getters.rwd !== 'mobile' || navOpened"
			:nav-targets="pages"
			:cur-page="$store.state.curPage"
			@changeCurPage="changeCurPage"
			@closeNav="navOpened = false"
		/>
	</header>
</template>

<script>
import Navigator from '@/components/Navigator.vue';
import { pages } from '@/util';
import { SET_CUR_PAGE } from '@/types';

export default {
	components: {
		Navigator,
	},
	data() {
		return {
			pages,
			navOpened: false,
		};
	},
	computed: {
		navTogglerImg() {
			const status = !this.navOpened ? 'toggler' : 'close';
			return require(`@/assets/img/ic_${status}.png`);
		},
	},
	methods: {
		changeCurPage(page) {
			this.$store.dispatch(
				'pageActions',
				{ type: SET_CUR_PAGE, payload: page }
			);
		},
	},
};
</script>
