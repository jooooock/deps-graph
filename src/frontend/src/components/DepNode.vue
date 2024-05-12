<script setup lang="ts">
import {Handle, Position, NodeProps} from '@vue-flow/core'
import {useElementStore} from "@/stores/elements";

const elementStore = useElementStore()

const props = defineProps<NodeProps>()
</script>

<template>
  <div>
    <div>{{ props.label }}</div>
    <div class="comment">{{props.data.comments}}</div>
    <input v-if="!props.data.isLeaf" type="checkbox" v-model="props.data.expand" @change="elementStore.toggle(props.data)">

    <Handle type="target" :position="Position.Top"/>
    <Handle type="source" :position="Position.Bottom"/>
  </div>
</template>

<style lang="scss">
.vue-flow__node-custom {
  position: relative;
  padding: 10px;
  border-radius: 3px;
  width: 150px;
  font-size: 12px;
  text-align: center;
  border-width: 1px;
  border-style: solid;
  color: var(--vf-node-text);
  background-color: var(--vf-node-bg);
  border-color: var(--vf-node-color);

  .comment {
    position: absolute;
    left: 0;
    bottom: 40px;
    color: grey;
    text-align: left;
    font-size: 10px;
    text-wrap: nowrap;
  }

  input {
    position: absolute;
    top: 0;
    right: 0;
  }

  &.leaf {
    --vf-handle: var(--vf-node-color, #ff0072);
    --vf-box-shadow: var(--vf-node-color, #ff0072);
    background: var(--vf-node-bg);
    border-color: var(--vf-node-color, #ff0072);

    .vue-flow__handle.source {
      display: none;
    }
  }
}
</style>
