<template>
  <main class="map-panel">
		<modal
			v-show="modalMsg"
			:able-to-close="ableToClose"
			@closeModal="modalMsg = false"
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
	props: {
		errMsg: {
			type: String,
			required: true,
		},
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
				setTimeout(() => this.modalMsg = false, 1500);
			}
		},
		errMsg(val) {
			if (val) {
				this.toggleModal({ msg: val, ableToClose: false });
			}
		},
	},
};
</script>
