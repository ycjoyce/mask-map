<template>
  <main class="map-panel">
		<modal
			v-show="modalMsg"
			@closeModal="toggleModal"
			:ableToClose="ableToClose"
		>
			{{modalMsg}}
		</modal>

    <my-map 
			@getMapMsg="toggleModal"
			:allPharmacyData="allPharmacyData"
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
}
</script>
