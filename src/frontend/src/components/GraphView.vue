<script setup lang="ts">
import {useModuleStore} from "@/stores/modules";

const moduleStore = useModuleStore()
</script>

<template>
  <div class="flex-grow-1 p-3">
    <div class="card mh-100">
      <h5 class="card-header">依赖图</h5>

    </div>
  </div>
</template>

<style scoped lang="scss">
.process-item {
  position: relative;

  .status {
    position: absolute;
    right: 0;
    top: 10px;
  }
}
</style>
