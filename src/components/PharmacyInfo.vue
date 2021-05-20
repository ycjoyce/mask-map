<template>
  <div class="pharmacy-info">
    <div class="pharmacy-title available">
			<h2 class="pharmacy-name text-color-pmr text-bold title-ttr">
				{{pharmacyInfo.name}}
			</h2>
			
			<span class="pharmacy-distance text-color-pmr text-bold text-sm">
				{{calDistance}} km
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
import { getDistance } from '@/assets/js/util';

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
			pharmacyGeo: this.pharmacyData.geometry || {},
			pharmacyDetail: {
				'address': '地址',
				'phone': '電話',
				'note': '備註',
			},
		};
	},
	computed: {
		calDistance() {
			if (!this.$store.state.userCurPos || !this.pharmacyGeo.coordinates) {
				return 0;
			}

			let originalCoords = this.pharmacyGeo.coordinates;
			let coords = originalCoords;

			if (originalCoords[0] > 100) {
				[coords[0], coords[1]] = [coords[1], coords[0]];
			}
			
			return getDistance(this.$store.state.userCurPos, coords).toFixed(2);
		},
	},
}
</script>
