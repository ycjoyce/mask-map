<template>
  <form class="search-bar">
		<div class="search-input-box">
			<search-input
				class="search-input"
				placeholder="請輸入地址或區域"
				:searchInput="searchInput"
				:disabled="disabled"
				@onSearchInput="onSearchInput"
				@onSearchKeyDown="onSearchKeyDown"
			/>

			<result-list 
				v-show="resultList.length > 0 && !hideResultList"
				:list="resultList"
				:focusedIdx="focusedItemIdx"
				@onResultClick="onResultClick"
			/>

			<input
				type="image"
				class="btn search-cancel"
				:src="require('@/assets/img/ic_delete.png')"
				v-show="searchInput"
				@click.prevent="searchInput = ''"
			>
		</div>
    
		<button
			class="btn btn-solid-pmr corner-round-sm box-sdw text-ttr search-submit"
			:disabled="disabled || !searchInput"
			@click.prevent="onSubmit"
		>
			搜尋
		</button> 
  </form>
</template>

<script>
import ResultList from '@/components/ResultList.vue';
import SearchInput from '@/components/SearchInput.vue';

export default {
	props: {
		disabled: {
			type: Boolean,
			required: true,
		},
	},
	components: {
		ResultList,
		SearchInput,
	},
	data() {
		return {
			hideResultList: false,
			resultList: [],
			searchInput: '',
			debounceSearchInput: '',
			timerID: null,
			resultClicked: false,
			focusedItemIdx: null,
		};
	},
	computed: {
		allPharmacyData() {
			return this.$store.state.maskData.map((pharmacy) => {
				const {
					properties: { id, address, county, cunli, town }
				} = pharmacy;
				return { id, county, cunli, town, address };
			});
		},
	},
	methods: {
		onSearchInput(val) {
			if (val === this.searchInput) {
				return;
			}
			clearTimeout(this.timerID);
			this.searchInput = val;
		},
		onSearchKeyDown(e) {
			const { key } = e;
			if (this.resultList.length < 1) {
				return;
			}
			if (key === 'ArrowUp') {
				if (!this.focusedItemIdx) {
					return;
				}
				this.focusedItemIdx -= 1;
				return;
			} 
			if (key === 'ArrowDown') {
				if (this.focusedItemIdx === null) {
					this.focusedItemIdx = 0;
					return;
				}
				if (this.focusedItemIdx === this.resultList.length - 1) {
					return;
				}
				this.focusedItemIdx += 1;
				return;
			}
			if (key === 'Enter') {
				e.preventDefault();
				if (this.focusedItemIdx === null) {
					return;
				}
				this.onResultClick(this.resultList[this.focusedItemIdx]);
				return;
			}
		},
		getResultList(input) {
			const filteredList = this.allPharmacyData.filter((pharmacy) => {
				const addressGroup = Object.values(pharmacy).filter((val) => {
					const [key] = Object.entries(pharmacy).find(([, v]) => v === val);
					return key !== 'id'
				});
				return addressGroup.some((item) => item.includes(input));
			}).map((pharmacy) => {
				const { county, town, cunli, address } = pharmacy;
				return [ county, county + town, county + town + cunli, address ];
			}).flat().filter((location, idx, arr) => {
				const include = location.includes(input) || input.includes(location);
				return include && arr.indexOf(location) === idx && location;
			});
			return filteredList;
		},
		onResultClick(location) {
			this.resultClicked = location;
			this.hideAndInitResultList();
		},
		onSubmit() {
			this.$emit('onSubmit', this.searchInput);
			this.hideAndInitResultList();
		},
		hideAndInitResultList() {
			this.hideResultList = true;
			this.focusedItemIdx = null;
		},
	},
	watch: {
		resultClicked(val) {
			if (!val) {
				return;
			}
			this.searchInput = val;
		},
		searchInput(val) {
			if (!val) {
				this.resultList = [];
				return;
			}
			if (this.resultClicked === val) {
				this.resultClicked = false;
				return;
			}
			this.timerID = setTimeout(() => {
				this.debounceSearchInput = val;
			}, 500);
		},
		debounceSearchInput(val) {
			this.resultList = this.getResultList(val);
			this.hideResultList = false;
		},
	},
};
</script>
