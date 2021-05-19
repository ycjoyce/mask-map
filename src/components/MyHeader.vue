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

		<navigator/>
	</header>
</template>

<script>
import Navigator from '@/components/Navigator.vue';

export default {
	components: {
		Navigator,
	},
}
</script>