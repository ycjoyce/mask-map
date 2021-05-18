<template>
  <nav class="header-nav">
    <ul class="nav-target-box">
			<li
				v-for="(target, targetIdx) in navTargets"
				:key="`target-${targetIdx}`"
				class="nav-target"
			>
				{{target}}
			</li>
		</ul>
  </nav>
</template>

<script>
export default {
	data() {
		return {
			navTargets: [
				'口罩供給現況', '口罩怎麼買'
			],
		};
	},
}
</script>
