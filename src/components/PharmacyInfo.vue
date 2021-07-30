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
					@click="checkOnMap(pharmacyInfo.id)"
					:disabled="!$store.state.mapRendered"
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
import getAvailableStatus from '@/mixins/getAvailableStatus';
import calDistance from '@/mixins/calDistance';
import { SET_PHARMACY_CHECKED } from '@/types';

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
			pharmacyDetail: {
				'address': '地址',
				'phone': '電話',
				'note': '備註',
			},
		};
	},
	computed: {
		pharmacyInfo() {
			return this.pharmacyData.properties || {};
		},
		pharmacyGeo() {
			return this.pharmacyData.geometry || {};
		},
		formattedTel() {
			return (phone) => {
				let dist = phone.split(')').shift().substr(2);
				let num = phone.split(')').pop();
				return `+886-${dist}-${num}`;
			};
		},
	},
	methods: {
		checkOnMap(id) {
			this.$store.dispatch(
				'mapActions',
				{ type: SET_PHARMACY_CHECKED, payload: id }
			);
		},
	},
};
</script>
