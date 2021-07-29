import { getDistance } from '@/util';

export default {
	computed: {
		calDistance() {
			return (coords, userPos = this.$store.state.userPos) => {
				const newCoords = coords.slice();
				if (coords[0] > 100) {
					[newCoords[0], newCoords[1]] = [newCoords[1], newCoords[0]];
				}
				return +getDistance(userPos, newCoords).toFixed(2);
			};
		},
	},
};
