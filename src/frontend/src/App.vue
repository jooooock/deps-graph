<script lang="ts" setup>
import Header from './components/Header.vue'
import ModuleList from "@/components/ModuleList.vue"
import GraphView from "@/components/GraphView.vue"
import DeploymentList from "@/components/DeploymentList.vue"
</script>

<template>
  <Header/>
  <div class="flex-grow-1 d-flex overflow-hidden">
    <ModuleList/>
    <GraphView/>
  </div>
<!--  <DeploymentList/>-->
</template>
