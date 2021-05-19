<template>
  <div class="pharmacy-info">
    <h2 class="pharmacy-name">
      {{pharmacyInfo.name}}
			
			<span class="pharmacy-distance">
				1.2 km
			</span>

			<span class="pharmacy-status">
				休息中
			</span>
    </h2>

		<ul class="pharmacy-detail list">
			<li
				class="list-item"
				v-for="(detailVal, detailKey) in pharmacyDetail"
				:key="detailKey"
			>
				<span class="list-item-title">
					{{detailVal}}
				</span>

				<span class="list-item-content">
					{{pharmacyInfo[detailKey]}}
				</span>

				<button
					class="btn btn-pure btn-underline text-sm list-item-btn"
					v-if="detailKey === 'address'"
				>
					於地圖查看
				</button>

				<button
					class="btn btn-pure btn-underline text-sm list-item-btn"
					v-else-if="detailKey === 'phone'"
				>
					撥打電話
				</button>
			</li>
		</ul>
  </div>
</template>

<script>
export default {
	props: {
		pharmacyData: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			pharmacyInfo: this.pharmacyData.properties || {},
			pharmacyGeo: this.pharmacyData.gemetry || {},
			pharmacyDetail: {
				'address': '地址',
				'phone': '電話',
				'note': '備註',
			},
		};
	},
}
</script>
