<template>
  <div class="search-bar">
    <input
      type="text"
			placeholder="請輸入地址或區域"
			class="search-input input-border"
		>

		<result-list/>

		<button
			class="btn btn-solid-pmr btn-circle search-cancel"
		></button>

		<button
			class="btn btn-solid-pmr btn-round search-submit"
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
