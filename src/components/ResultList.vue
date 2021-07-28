<template>
  <ul
    ref="result-list"
    class="result-list"
    @click="onResultClick"
  >
    <li
      v-for="(location, idx) in list"
      :key="location"
      :class="[
        'result-list-item',
        { active: idx === focusedIdx }
      ]"
      :data-location="location"
    >
      {{location}}
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      required: true,
    },
    focusedIdx: {
      required: false,
      type: Number,
    },
  },
  methods: {
    onResultClick(e) {
      const { location } = e.target.dataset;
      this.$emit('onResultClick', location);
    },
    setListScrollTop(list, focusedItem) {
      if (!focusedItem) return;
      const listRect = list.getBoundingClientRect();
      const itemRect = focusedItem.getBoundingClientRect();
      if (itemRect.bottom - listRect.top > list.offsetHeight) {
        list.scrollTop += itemRect.bottom - listRect.top - list.offsetHeight;
        return;
      }
      if (itemRect.top - listRect.top < 0) {
        list.scrollTop -= (itemRect.top - listRect.top) * -1;
        return;
      }
    },
  },
  watch: {
    focusedIdx(idx) {
      const location = this.list[idx];
      const list = this.$refs['result-list'];
      const focusedItem = this.$refs['result-list'].querySelector(`[data-location = "${location}"]`);
      this.setListScrollTop(list, focusedItem);
    },
  },
};
</script>
