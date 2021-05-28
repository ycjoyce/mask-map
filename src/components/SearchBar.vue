<template>
  <div class="search-bar">
		<div class="search-input-box">
			<input
				type="text"
				placeholder="請輸入地址或區域"
				class="search-input input-border input-round-sm"
				:disabled="disabled"
				v-model="inputVal"
			>

			<result-list v-show="false"/>

			<input
				type="image"
				class="btn search-cancel"
				:src="require('@/assets/img/ic_delete.png')"
			>
		</div>
    
		<button
			class="btn btn-solid-pmr corner-round-sm box-sdw text-ttr search-submit"
			:disabled="disabled"
		>
			搜尋
		</button>
  </div>
</template>

<script>
import ResultList from '@/components/ResultList.vue';

export default {
	props: {
		disabled: {
			type: Boolean,
			required: true,
		},
		filteredData: {
			type: Array,
			required: false,
		},
	},
	components: {
		ResultList,
	},
	data() {
		return {
			inputVal: '',
		};
	},
	watch: {
		inputVal(val) {
			this.$emit('inputVal', val);
		},
	},
}
</script>
