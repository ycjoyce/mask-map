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
			availableMap: {},
		};
	},
	computed: {
		weekday() {
			return new Date(this.$store.state.refreshListTime).getDay();
		},
	},
	methods: {
		openRuleModal() {
			this.$emit('openRuleModal', true);
		},
	},
	created() {
		for (let i = 0; i < 7; i++) {
			if (i === 0) {
				this.availableMap[i] = '全民';
				continue;
			}
			if (i % 2 === 0) {
				this.availableMap[i] = '偶數';
				continue;
			}
			this.availableMap[i] = '奇數';
		}
	},
};
</script>
