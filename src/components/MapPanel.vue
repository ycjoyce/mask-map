<template>
  <main class="map-panel">
		<modal
			v-show="modalMsg"
			:able-to-close="ableToClose"
			@closeModal="toggleModal"
		>
			{{modalMsg}}
		</modal>

    <my-map 
			:all-pharmacy-data="$store.state.maskData"
			:default-pos="defaultPos"
			@setMapMsg="toggleModal"
		/>

		<my-footer/>
  </main>
</template>

<script>
import Modal from '@/components/Modal.vue';
import MyMap from '@/components/MyMap.vue';
import MyFooter from '@/components/MyFooter.vue';

export default {
	components: {
		Modal,
		MyMap,
		MyFooter,
	},
	data() {
		return {
			modalMsg: false,
			ableToClose: true,
			defaultPos: {
				name: '台北車站',
				coords: [25.0457377, 121.5129428],
			},
		};
	},
	methods: {
		toggleModal({ msg, ableToClose }) {
			this.modalMsg = msg;
			this.ableToClose = ableToClose;
		},
	},
	watch: {
		'$store.state.mapRendered': function(val) {
			if (val) {
				this.toggleModal(false);
			}
		},
	},
};
</script>
