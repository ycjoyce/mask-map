<template>
  <main class="map-panel">
		<modal
			v-show="modalMsg"
			@closeModal="toggleModal"
			:able-to-close="ableToClose"
		>
			{{modalMsg}}
		</modal>

    <my-map 
			@getMapMsg="toggleModal"
			:all-pharmacy-data="allPharmacyData"
			:re-render="reRender"
			:back-to-user-pos="backToUserPos"
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
	props: {
		allPharmacyData: {
      type: Array,
      required: false,
		},
		reRender: {
			type: Boolean,
			required: true,
		},
		backToUserPos: {
			type: Number,
			required: false,
		},
	},
	data() {
		return {
			modalMsg: false,
			ableToClose: true,
		};
	},
	methods: {
		toggleModal({msg, ableToClose}) {
			this.modalMsg = msg;

			if (!ableToClose) {
				this.ableToClose = false;
			}
		},
	},
};
</script>
