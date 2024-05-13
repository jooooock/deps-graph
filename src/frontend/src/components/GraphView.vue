<script setup lang="ts">
import { VueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { MiniMap } from '@vue-flow/minimap'
import { Controls } from '@vue-flow/controls'
import {useElementStore} from "@/stores/elements"
import DepNode from "@/components/DepNode.vue"

import '@vue-flow/minimap/dist/style.css'
import '@vue-flow/controls/dist/style.css'

const elementStore = useElementStore()
</script>

<template>
  <div class="flex-grow-1 p-3">
    <div class="card w-100 h-100">
      <h5 class="card-header">依赖图</h5>
      <VueFlow fit-view-on-init :nodes="elementStore.nodes" :edges="elementStore.edges">
        <Background />
        <MiniMap />
        <Controls />

        <template #node-custom="props">
          <DepNode v-bind="props" />
        </template>
      </VueFlow>
    </div>
  </div>
</template>

<style>
@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css';
</style>

<style scoped lang="scss">
.vue-flow__node-custom {
  background: purple;
  color: white;
  border: 1px solid purple;
  border-radius: 4px;
  box-shadow: 0 0 0 1px purple;
  padding: 8px;
}
</style>
