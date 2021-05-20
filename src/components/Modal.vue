<template>
  <div class="modal">
		<div class="modal-content">
			<input
				type="image"
				class="modal-close"
				:src="require('@/assets/img/ic_close.png')"
				@click="closeModal"
				v-if="ableToClose"
			>

			<slot></slot>
		</div>
  </div>
</template>

<script>
export default {
	props: {
		ableToClose: {
			type: Boolean,
			required: false,
			default() {
				return true;
			},
		},
	},
	methods: {
		closeModal() {
			this.$emit('closeModal', false);
		},
	},
}
</script>
