<template>
  <div class="pharmacy-card corner-round box-sdw">
		<div class="amt-box-container">
			<amt-box/>
		</div>
    
		<pharmacy-info/>
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
}
</script>
