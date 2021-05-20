<template>
  <main class="map-panel">
    <my-map/>

		<my-footer/>
  </main>
</template>

<script>
import MyMap from '@/components/MyMap.vue';
import MyFooter from '@/components/MyFooter.vue';

export default {
	components: {
		MyMap,
		MyFooter,
	},
}
</script>
