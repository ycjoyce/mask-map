<template>
  <div>
		<my-header/>
		<div>
			<data-panel/>

			<map-panel/>
		</div>
	</div>
</template>

<script>
import MyHeader from '@/components/MyHeader.vue';
import DataPanel from '@/components/DataPanel.vue';
import MapPanel from '@/components/MapPanel.vue';

export default {
	name: 'App',
	components: {
		MyHeader,
		DataPanel,
		MapPanel,
	},
}
</script>
