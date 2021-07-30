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
		targetTime() {
			return this.$store.state.refreshListTime;
		},
        availableStatus() {
            return (pharmacyInfo) => {
				let pharmacyInfoCopied = { ...pharmacyInfo };

				if (!pharmacyInfo.available) {
					pharmacyInfoCopied = {
						...pharmacyInfoCopied,
						available: '星期一上午看診、星期二上午看診、星期三上午看診、星期四上午看診、星期五上午看診、星期六上午看診、星期日上午看診、星期一下午休診、星期二下午休診、星期三下午休診、星期四下午休診、星期五下午休診、星期六下午休診、星期日下午休診、星期一晚上休診、星期二晚上休診、星期三晚上休診、星期四晚上休診、星期五晚上休診、星期六晚上休診、星期日晚上休診',
					};
				}

                if (Object.keys(pharmacyInfoCopied).length < 1 || !this.getTimePeriod(this.targetTime)) {
                    return 'unavailable';
                }
    
                const hour = `${new Date(this.targetTime).getHours()}`;
                const seamTimes = {
                    11: ['morning', 'afternoon'],
                    17: ['afternoon', 'night'],
                };
				const statusMap = this.analyzeDataStatus(
					new Date(this.targetTime).getDay(),
					pharmacyInfoCopied
				);

                for (let time in seamTimes) {
                    if (hour === time) {
                        if (
                            statusMap[seamTimes[time][0]] === 'available' &&
                            statusMap[seamTimes[time][1]] === 'unavailable'
                        ) {
                            return 'danger';
                        }
                    }
                }

                return statusMap[this.getTimePeriod(this.targetTime)];
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
				if (targetAmt < 1) {
					return 'unavailable';
                }
				if (targetAmt >= totalMask * 0.1) {
					return 'available';
				}
				return 'danger';
			}
		},
	},
};
