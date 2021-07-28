import { getDistance } from '@/util';

export default {
	methods: {
		calDistance(coords) {
			const newCoords = coords.slice();
			if (coords[0] > 100) {
				[newCoords[0], newCoords[1]] = [newCoords[1], newCoords[0]];
			}
			return +getDistance(
				this.$store.state.userCurPos,
				newCoords
			).toFixed(2);
		},
	},
};
