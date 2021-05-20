<template>
  <div class="modal">
		<div class="modal-content">
			<input
				type="image"
				class="modal-close"
				:src="require('@/assets/img/ic_close.png')"
				@click="closeModal"
			>

			<slot></slot>
		</div>
  </div>
</template>

<script>
export default {
	methods: {
		closeModal() {
			this.$emit('closeModal', false);
		},
	},
}
</script>
