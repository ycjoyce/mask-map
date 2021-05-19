<template>
  <div class="pharmacy-info">
    <div class="pharmacy-title available">
			<h2 class="pharmacy-name text-color-pmr text-bold title-ttr">
				{{pharmacyInfo.name}}
			</h2>
			
			<span class="pharmacy-distance text-color-pmr text-bold text-sm">
				1.2 km
			</span>

			<span class="pharmacy-status text-sm text-bg-available corner-round-sm">
				休息中
			</span>
    </div>

		<ul class="pharmacy-detail-list list">
			<li
				class="pharmacy-detail-list-item list-item"
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
					class="btn text-sm text-underline text-color-basic list-item-btn"
					v-if="detailKey === 'address'"
				>
					於地圖查看
				</button>

				<button
					class="btn text-sm text-underline text-color-basic list-item-btn"
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
