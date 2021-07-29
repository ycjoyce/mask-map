<template>
  <nav class="header-nav">
    <ul class="nav-target-box">
			<li
				v-for="[key, val] in Object.entries(navTargets)"
				:key="key"
				:class="[
					'nav-target',
					'title-ttr',
					'text-color-pmr',
					{ active: key === curPage }
				]"
				@click="changeCurPage(key)"
			>
				{{val}}
			</li>
		</ul>
  </nav>
</template>

<script>
export default {
	props: {
		curPage: {
			type: String,
			required: true,
		},
		navTargets: {
			type: Object,
			required: true,
		},
	},
	methods: {
		changeCurPage(page) {
			if (this.$store.getters.rwd === 'mobile') {
				this.$emit('onClosed');
			}
			this.$emit('onPageChange', page);
		},
	},
};
</script>
