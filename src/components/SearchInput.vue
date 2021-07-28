<template>
  <input
		type="text"
		class="input-border input-round-sm"
		:placeholder="placeholder"
		:disabled="disabled"
		:value="searchInput"
		@input="onSearchInput"
		@keydown="onKeyDown($event)"
	>
</template>

<script>
export default {
	props: {
		placeholder: {
			required: false,
			type: String,
		},
		searchInput: {
			required: true,
			type: String,
		},
		disabled: {
			required: true,
			type: Boolean,
			default: () => false,
		},
		clear: {
			required: false,
			type: Boolean,
		},
	},
	methods: {
		onSearchInput(e) {
			const { value } = e.target;
			if (value === this.searchInput) {
				return;
			}
			this.$emit('onSearchInput', value);
		},
		onKeyDown(e) {
			this.$emit('onSearchKeyDown', e);
		},
	},
};
</script>
