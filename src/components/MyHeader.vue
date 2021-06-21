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
				@click="toggleNav"
			>
		</div>

		<navigator
			v-show="$store.getters.rwd !== 'mobile' || navOpened"
			:cur-page="curPage"
			:nav-targets="navTargets"
			@changeCurPage="changeCurPage"
			@closeNav="navOpened = false"
		/>
	</header>
</template>

<script>
import Navigator from '@/components/Navigator.vue';

export default {
	props: {
		curPage: {
			type: String,
			required: true,
		},
		navTargets: {
			type: Array,
			required: true,
		},
	},
	components: {
		Navigator,
	},
	data() {
		return {
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
		toggleNav() {
			this.navOpened = !this.navOpened;
		},
		changeCurPage(page) {
			this.$emit('changeCurPage', page);
		},
	},
};
</script>
