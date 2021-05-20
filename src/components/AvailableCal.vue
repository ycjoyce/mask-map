<template>
  <div class="available-box text-color-pmr">
    <span
			class="available-target text-bold title-pmr"
		>
			{{availableMap[weekday]}}
		</span>

		<span class="available-text">
			購買日
		</span>

		<input
			type="image"
			class="btn available-ques"
			:src="require('@/assets/img/ic_help.png')"
			@click="openRuleModal"
		>
  </div>
</template>

<script>
export default {
	data() {
		return {
			availableMap: {
				0: '全民',
				1: '奇數',
				2: '偶數',
				3: '奇數',
				4: '偶數',
				5: '奇數',
				6: '偶數',
			}
		};
	},
	computed: {
		weekday() {
			return new Date(this.$store.state.refreshListTime.time).getDay();
		},
	},
	methods: {
		openRuleModal() {
			this.$emit('openRuleModal', true);
		},
	},
}
</script>
