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
