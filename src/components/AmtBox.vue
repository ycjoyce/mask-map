<template>
  <div
    :class="[
			'amt-box',
			'amt-box-available',
			'corner-round-sm',
			`amt-box-${maskStatus}`
		]"
	>
		<p class="amt-box-title">
			{{typeMap[type]}}口罩數量
		</p>

		<p class="amt-box-amt text-sm">
			<span class="amt-box-num text-bold title-pmr">
				{{maskAmt}}
			</span>
			片
		</p>
  </div>
</template>

<script>
export default {
	props: {
		type: {
			type: String,
			required: true,
		},
		maskAmt: {
			type: Number,
			required: true,
		},
	},
	data() {
		return {
			typeMap: {
				'adult': '成人',
				'child': '兒童',
			},
			safeMaskAmt: 100,
		};
	},
	computed: {
		maskStatus() {
			if (this.maskAmt >= this.safeMaskAmt) {
				return 'available';
			}
			if (this.maskAmt < 1) {
				return 'unavailable';
			}
			return 'danger;'
		},
	},
}
</script>
