<template>
  <nav class="header-nav">
    <ul class="nav-target-box">
			<li
				v-for="target in navTargets"
				:key="target"
				:class="[
					'nav-target',
					'title-ttr',
					'text-color-pmr',
					{ active: target === curPage }
				]"
				@click="changeCurPage(target)"
			>
				{{target}}
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
			type: Array,
			required: true,
		},
	},
	methods: {
		changeCurPage(page) {
			if (this.$store.getters.rwd === 'mobile') {
				this.$emit('closeNav');
			}
			this.$emit('changeCurPage', page);
		},
	},
};
</script>
