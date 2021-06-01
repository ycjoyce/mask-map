<template>
  <div class="search-bar">
		<div class="search-input-box">
			<input
				type="text"
				placeholder="請輸入地址或區域"
				class="search-input input-border input-round-sm"
				:disabled="disabled"
				v-model="inputVal"
				ref="search-input"
				@input="clearData"
			>

			<result-list 
				:filteredData="filteredData"
				v-show="filteredData.length > 0 && !hideResultList"
				@chooseLocation="chooseLocation"
			/>

			<input
				type="image"
				class="btn search-cancel"
				:src="require('@/assets/img/ic_delete.png')"
				v-show="inputVal"
				@click="clearInputVal"
			>
		</div>
    
		<button
			class="btn btn-solid-pmr corner-round-sm box-sdw text-ttr search-submit"
			:disabled="disabled || !inputVal"
			@click="sendKeyword"
		>
			搜尋
		</button>
  </div>
</template>

<script>
import ResultList from '@/components/ResultList.vue';

export default {
	props: {
		disabled: {
			type: Boolean,
			required: true,
		},
		filteredData: {
			type: Array,
			required: false,
		},
	},
	components: {
		ResultList,
	},
	data() {
		return {
			inputVal: '',
			hideResultList: false,
			chosenLocation: null,
		};
	},
	methods: {
		clearData() {
			this.hideResultList = false;
			this.chosenLocation = null;
		},
		clearInputVal() {
			this.inputVal = '';
		},
		chooseLocation(location) {
			let word = '';
			for (let key in location) {
				word += location[key];
			}
			this.hideResultList = true;
			this.inputVal = word;
			this.chosenLocation = location;
		},
		sendKeyword() {
			this.$emit('chooseLocation', {
				input: this.inputVal,
				location: this.chosenLocation,
			});
		},
	},
	watch: {
		inputVal(val) {
			this.$emit('inputVal', {
				val,
				el: this.$refs['search-input'],
			});
		},
	},
}
</script>
