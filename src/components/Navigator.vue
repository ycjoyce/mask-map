<template>
  <nav class="header-nav">
    <ul class="nav-target-box">
			<li
				v-for="(target, targetIdx) in navTargets"
				:key="`target-${targetIdx}`"
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
	},
	data() {
		return {
			navTargets: [
				'口罩供給現況', '口罩怎麼買'
			],
		};
	},
	methods: {
		changeCurPage(page) {
			if (page === '口罩怎麼買') {
				this.$emit('openMaskRuleModal');
			}
		},
	},
}
</script>
