export default {
    data() {
        return {
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
        availableStatus() {
            return (pharmacyInfo) => {
                if (Object.keys(pharmacyInfo).length < 1 || !this.getTimePeriod(Date.now())) {
                    return 'unavailable';
                }
    
                const hour = `${new Date().getHours()}`;
                let seamTimes = {
                    11: ['morning', 'afternoon'],
                    17: ['afternoon', 'night'],
                };
    
                for (let time in seamTimes) {
                    if (hour === time) {
                        if (
                            this.analyzeDataStatus(new Date().getDay(), pharmacyInfo)[seamTimes[time][0]] === 'available' &&
                            this.analyzeDataStatus(new Date().getDay(), pharmacyInfo)[seamTimes[time][1]] === 'unavailable'
                        ) {
                            return 'danger';
                        }
                    }
                }

                return this.analyzeDataStatus(new Date().getDay(), pharmacyInfo)[this.getTimePeriod(Date.now())];
            }
		},
		analyzeDataStatus() {
			return (weekday, pharmacyInfo) => {
				const availableArr = pharmacyInfo['available'].split('、');
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
        maskStatus() {
			return (totalMask, targetAmt) => {
				const safeAmt = totalMask * 0.1;
				
				if (targetAmt >= safeAmt && targetAmt > 0) {
					return 'available';
				}
				if (targetAmt < 1) {
					return 'unavailable';
                }
				return 'danger';
			}
		},
    },
};
