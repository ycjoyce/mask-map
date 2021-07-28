<template>
  <div class="data-detail">
    <ul class="data-detail-list list text-sm">
			<li
				class="list-item"
				v-show="range"
			>
				{{range}}的供應商
			</li>

			<li class="list-item">
				資料更新時間 {{formattedTime($store.state.refreshList.time)}}
			</li>
		</ul>

		<button
			class="btn btn-border-pmr corner-round-lg data-detail-refresh"
			@click="refreshList"
			:disabled="disabled"
		>
			重整列表
		</button>
  </div>
</template>

<script>
import { REFRESH_LIST } from '@/types';

export default {
	props: {
		range: {
			type: String,
			required: true,
		},
		disabled: {
			type: Boolean,
			required: true,
		},
	},
	methods: {
		refreshList() {
			this.$store.dispatch(
				'maskActions',
				{
					type: REFRESH_LIST,
					payload: { time: Date.now() }
				}
			);
		},
	},
	computed: {
		formattedTime() {
			return (time) => {
				return new Date(time).toLocaleTimeString();
			};
		},
	},
};
</script>
