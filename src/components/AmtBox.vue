<template>
  <div
    :class="[
			'amt-box',
			'corner-round-sm',
			`amt-box-${maskStatus(totalMask, maskAmt[type])}`
		]"
	>
		<p class="amt-box-title">
			{{typeMap[type]}}口罩數量
		</p>

		<p class="amt-box-amt text-sm">
			<span class="amt-box-num text-bold title-pmr">
				{{maskAmt[type]}}
			</span>
			片
		</p>
  </div>
</template>

<script>
import getAvailableStatus from '@/assets/js/getAvailableStatus';

export default {
	mixins: [getAvailableStatus],
	props: {
		type: {
			type: String,
			required: true,
		},
		maskAmt: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			typeMap: {
				'adult': '成人',
				'child': '兒童',
			},
			totalMask: 0,
		};
	},
	created() {
		for (let type in this.maskAmt) {
			this.totalMask += this.maskAmt[type];
		}
	},
}
</script>
