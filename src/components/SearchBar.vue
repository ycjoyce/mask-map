<template>
  <div class="search-bar">
		<div class="search-input-box">
			<input
				type="text"
				placeholder="請輸入地址或區域"
				class="search-input input-border input-round-sm"
				@input="handleInputVal"
				:disabled="disabled"
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
	},
	components: {
		ResultList,
	},
	methods: {
		handleInputVal(e) {
			let val = e.target.value.trim();
			this.$emit('inputVal', val);
		},
	},
}
</script>
