<template>
  <div class="pharmacy-card corner-round-sm box-sdw">
		<div class="amt-box-container">
			<amt-box
				v-for="ageType in ageTypes"
				:key="ageType"
				:type="ageType"
				:maskAmt="pharmacyData.properties[`mask_${ageType}`]"
			/>
		</div>
    
		<pharmacy-info
			:pharmacyData="pharmacyData"
		/>
  </div>
</template>

<script>
import AmtBox from '@/components/AmtBox.vue';
import PharmacyInfo from '@/components/PharmacyInfo';

export default {
	components: {
		AmtBox,
		PharmacyInfo,
	},
	props: {
		pharmacyData: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			ageTypes: ['adult', 'child'],
		};
	},
}
</script>
