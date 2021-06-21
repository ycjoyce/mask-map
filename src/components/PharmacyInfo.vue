<template>
  <div class="pharmacy-info">
    <div :class="['pharmacy-title', availableStatus(pharmacyInfo)]">
			<h2 class="pharmacy-name text-color-pmr text-bold title-ttr">
				{{pharmacyInfo.name}}
			</h2>
			
			<span class="pharmacy-distance text-color-pmr text-bold text-sm">
				{{calDistance(pharmacyGeo.coordinates)}} km
			</span>

			<span
				:class="[
					'pharmacy-status',
					'text-sm',
					`text-bg-${availableStatus(pharmacyInfo)}`,
					'corner-round-sm'
				]"
			>
				{{availableStatusMap[availableStatus(pharmacyInfo)]}}
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
					@click="checkOnMap"
				>
					於地圖查看
				</button>

				<a
					class="btn text-sm text-underline text-color-basic list-item-btn"
					v-else-if="detailKey === 'phone'"
					:href="`tel:${formattedTel(pharmacyInfo.phone)}`"
				>
					撥打電話
				</a>
			</li>
		</ul>
  </div>
</template>

<script>
import getAvailableStatus from '@/assets/js/getAvailableStatus';
import calDistance from '@/assets/js/calDistance';

export default {
	mixins: [
		getAvailableStatus,
		calDistance
	],
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
		formattedTel() {
			return (phone) => {
				let dist = phone.split(')').shift().substr(2);
				let num = phone.split(')').pop();
				return `+886-${dist}-${num}`;
			};
		},
	},
	methods: {
		checkOnMap() {
			this.$store.commit('setCheckedPharmacy', this.pharmacyInfo.id);
		},
	},
};
</script>
