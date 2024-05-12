<script setup lang="ts">
import type { Elements } from '@vue-flow/core'
import { VueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { MiniMap } from '@vue-flow/minimap'
import { Controls } from '@vue-flow/controls'
import {useModuleStore} from "@/stores/modules"
import {ref} from "vue"
import {useElementStore} from "@/stores/elements"
import DepNode from "@/components/DepNode.vue"

import '@vue-flow/minimap/dist/style.css'
import '@vue-flow/controls/dist/style.css'

const elementStore = useElementStore()

const elements = ref<Elements>([
  // nodes

  // an input node, specified by using `type: 'input'`
  { id: '1', type: 'input', label: 'Node 1', position: { x: 250, y: 5 } },

  // default node, you can omit `type: 'default'` as it's the fallback type
  { id: '2', label: 'Node 2', position: { x: 100, y: 100 }, },

  // An output node, specified by using `type: 'output'`
  { id: '3', type: 'output', label: 'Node 3', position: { x: 400, y: 200 } },

  // A custom node, specified by using a custom type name
  // we choose `type: 'special'` for this example
  // {
  //   id: '4',
  //   type: 'special',
  //   label: 'Node 4',
  //   position: { x: 400, y: 200 },
  //
  //   // pass custom data to the node
  //   data: {
  //     // you can pass any data you want to the node
  //     hello: 'world',
  //   },
  // },

  // edges

  // simple default bezier edge
  // consists of an id, source-id and target-id
  { id: 'e1-3', source: '1', target: '3' },

  // an animated edge, specified by using `animated: true`
  { id: 'e1-2', source: '1', target: '2', animated: true },

  // a custom edge, specified by using a custom type name
  // we choose `type: 'special'` for this example
  // {
  //   id: 'e1-4',
  //   type: 'special',
  //   source: '1',
  //   target: '4',
  //
  //   // pass custom data to the edge
  //   data: {
  //     // You can pass any data you want to the edge
  //     hello: 'world',
  //   }
  // },
])
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
