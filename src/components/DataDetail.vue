<template>
  <div class="data-detail">
    <ul class="data-detail-list list text-sm">
			<li class="list-item">
				距離附近 5公里 以內的供應商
			</li>

			<li class="list-item">
				資料更新時間 {{formattedTime($store.state.refreshListTime.time)}}
			</li>
		</ul>

		<button
			class="btn btn-border-pmr corner-round-lg"
			@click="refreshList"
		>
			重整列表
		</button>
  </div>
</template>

<script>
export default {
	methods: {
		refreshList() {
			this.$store.commit('refreshList', {
				click: true,
				time: Date.now(),
			});
		},
	},
	computed: {
		formattedTime() {
			return (time) => {
				return new Date(time).toLocaleTimeString();
			}
		},
	},
}
</script>
