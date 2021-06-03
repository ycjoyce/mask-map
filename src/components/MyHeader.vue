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
				type="image"
				:src="navTogglerImg"
				class="nav-toggler btn"
				v-show="$store.getters.rwd === 'mobile'"
				@click="toggleNav"
			>
		</div>

		<navigator
			@openMaskRuleModal="openMaskRuleModal"
			@backToDataPanel="backToDataPanel"
			@closeNav="navOpened = false"
			:curPage="curPage"
			:navTargets="navTargets"
			v-show="$store.getters.rwd !== 'mobile' || navOpened"
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
	},
	components: {
		Navigator,
	},
	data() {
		return {
			navOpened: false,
			navTargets: [
				'口罩供給現況', '口罩怎麼買'
			],
		};
	},
	computed: {
		navTogglerImg() {
			if (!this.navOpened) {
				return require('@/assets/img/ic_toggler.png');
			}
			return require('@/assets/img/ic_close.png');
		},
	},
	methods: {
		openMaskRuleModal() {
			this.$emit('openMaskRuleModal');
		},
		toggleNav() {
			this.navOpened = !this.navOpened;
		},
		backToDataPanel() {
			this.$emit('backToDataPanel');
		},
	},
}
</script>