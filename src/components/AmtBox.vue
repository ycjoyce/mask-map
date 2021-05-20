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
				{{maskAmt[type]}}
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
			toalMaskAmt: 0,
		};
	},
	computed: {
		maskStatus() {
			const safeAmt = this.toalMaskAmt * 0.1;

			if (this.maskAmt[this.type] >= safeAmt) {
				return 'available';
			}
			if (this.maskAmt[this.type] < 1) {
				return 'unavailable';
			}
			return 'danger';
		},
	},
	created() {
		for (let type in this.maskAmt) {
			this.toalMaskAmt += this.maskAmt[type];
		}
	},
}
</script>
