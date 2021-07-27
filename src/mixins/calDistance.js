import { getDistance } from '@/util';

export default {
	computed: {
		calDistance() {
			return (coordsFromData) => {
				if (!this.$store.state.userCurPos || !coordsFromData) {
					return 0;
				}
	
				let originalCoords = coordsFromData;
				let coords = originalCoords;
	
				if (originalCoords[0] > 100) {
					[coords[0], coords[1]] = [coords[1], coords[0]];
				}
	
				return getDistance(this.$store.state.userCurPos, coords).toFixed(2);
			}
		},
	},
};
