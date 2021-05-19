<template>
  <div class="search-bar">
		<div class="search-input-box">
			<input
				type="text"
				placeholder="請輸入地址或區域"
				class="search-input input-border input-round-sm"
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
		>
			搜尋
		</button>
  </div>
</template>

<script>
import ResultList from '@/components/ResultList.vue';

export default {
	components: {
		ResultList,
	},
}
</script>
