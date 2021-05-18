<template>
  <div>
		<my-header/>
		<div>
			<data-panel/>
		</div>
	</div>
</template>

<script>
import MyHeader from '@/components/MyHeader.vue';
import DataPanel from '@/components/DataPanel.vue';

export default {
	name: 'App',
	components: {
		MyHeader,
		DataPanel,
	},
}
</script>
