<template>
	<header class="header">
		<div class="header-logo-box logo-box">
			<img
				:src="require('@/assets/img/logo.png')"
				alt="口罩即時查"
				class="logo-img"
			>

			<h1 class="logo-title title-sdr text-color-pmr">
				口罩即時查
			</h1>
		</div>

		<navigator
			@openMaskRuleModal="openMaskRuleModal"
			:curPage="curPage"
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
	methods: {
		openMaskRuleModal() {
			this.$emit('openMaskRuleModal');
		},
	},
}
</script>