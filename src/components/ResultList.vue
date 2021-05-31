<template>
  <ul class="result-list">
    <li
      v-for="(location, index) in filteredData"
      :key="index"
      class="result-list-item"
      @click="chooseLocation(location)"
    >
      {{combinedData(location)}}
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    filteredData: {
      type: Array,
      required: false,
    },
  },
  computed: {
    combinedData() {
      return (location) => {
        let result = '';
        for (let key in location) {
          if (!{}.hasOwnProperty.call(location, key)) {
            continue;
          }
          if (location[key]) {
            result += location[key];
          }
        }
        
        return result;
      }
    },
  },
  methods: {
    chooseLocation(location) {
      this.$emit('chooseLocation', location);
    },
  },
}
</script>
