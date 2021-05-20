<template>
  <div class="pharmacy-info">
    <div :class="['pharmacy-title', availableStatus]">
			<h2 class="pharmacy-name text-color-pmr text-bold title-ttr">
				{{pharmacyInfo.name}}
			</h2>
			
			<span class="pharmacy-distance text-color-pmr text-bold text-sm">
				{{calDistance}} km
			</span>

			<span
				:class="[
					'pharmacy-status',
					'text-sm',
					`text-bg-${availableStatus}`,
					'corner-round-sm']"
			>
				{{availableStatusMap[availableStatus]}}
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
			availableStatusMap: {
				'available': '營業中',
				'unavailable': '休息中',
				'danger': '即將休息',
			},
			transferStatusMap: {
				'看診': 'available',
				'休診': 'unavailable',
			},
			weekdayMap: {
				0: '星期日',
				1: '星期一',
				2: '星期二',
				3: '星期三',
				4: '星期四',
				5: '星期五',
				6: '星期六',
			},
			timeMap: {
				'上午': 'morning',
				'下午': 'afternoon',
				'晚上': 'night',
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
		availableStatus() {
			if (!this.pharmacyInfo || this.getTimePeriod(Date.now())) {
				return 'unavailable';
			}
			
			const hour = new Date().getHours();
			let seamTimes = {
				11: ['morning', 'afternoon'],
				17: ['afternoon', 'night'],
			};

			for (let time in seamTimes) {
				if (hour === time) {
					if (
						this.transferStatusMap[this.analyzeDataStatus(new Date().getDay())[seamTimes[time][0]]] === 'available' &&
						this.transferStatusMap[this.analyzeDataStatus(new Date().getDay())[seamTimes[time][1]]] === 'unavailable'
					) {
						return 'danger';
					}
				}
			}

			return this.transferStatusMap[
				this.analyzeDataStatus(new Date().getDay())[
					this.getTimePeriod(Date.now())
				]
			];
		},
		analyzeDataStatus() {
			return (weekday) => {
				const availableArr = this.pharmacyInfo.available.split('、');
				const targetDayAvailableArr = availableArr.filter((item) => item.includes(this.weekdayMap[weekday]));

				const result = targetDayAvailableArr.reduce((a, e) => {
					const time = this.timeMap[e.substring(3, 5)];
					const status = e.substr(5);
					a[time] = this.transferStatusMap[status];
					return a;
				}, {});
				
				return result;
			}
		},
		getTimePeriod() {
			return (time) => {
				const hour = new Date(time).getHours();
				if (hour >= 9 && hour < 12) {
					return 'morning';
				}
				if (hour >= 12 && hour < 18) {
					return 'afternoon';
				}
				if (hour >= 18 && hour < 23) {
					return 'night';
				}
				return false;
			}
		},
	},
	mounted() {
		console.log(this.getTimePeriod(Date.now()));
	},
}
</script>
