<script lang="ts" setup>
import {useModuleStore} from "@/stores/modules";
import {ref, watch} from "vue";

const moduleStore = useModuleStore()

const query = ref('')
watch(query, value => {
  moduleStore.search(value)
})


function switchEntry(entry: string) {
  fetch(`http://localhost:8000/api/modules/deps?id=${entry}&hash=${moduleStore.uuid}`).then(resp => resp.json()).then(resp => {
    const {code, data, message} = resp
    if (code === 0) {

    } else {
      alert(message)
    }
  })
}
</script>

<template>
  <div class="py-3">
    <details open>
      <summary></summary>
      <div class="wrapper">
        <h5 class="text-center py-2 mb-0 pt-3">模块列表</h5>
        <hr class="my-2">
        <p class="px-3 text-danger" v-if="moduleStore.modules.length === 0">请先选择 js 文件并进行解析</p>
        <div v-else>
          <input v-model="query" class="w-100 mb-2" type="search" placeholder="搜索">
          <ul>
            <li v-for="(module, index) in moduleStore.modules" :key="module.id" @click="switchEntry(module.id)">
              <p class="mb-0">
                <span>#{{ index + 1 }}. </span>
                <span class="text-primary">{{ module.id }}</span>
              </p>

              <p class="mb-0" v-for="(comment, idx) in module.comments" :key="idx">{{ comment }}</p>
            </li>
          </ul>
        </div>
      </div>
    </details>
  </div>
</template>

<style scoped lang="scss">
details {
  position: relative;
  border: 1px solid #cececf;
  min-width: 1rem;
  height: calc(100vh - 54px);
  box-sizing: border-box;
  overflow: hidden;

  &[open] {
    width: 340px;
  }

  summary {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 1rem;
    padding-left: 3px;
    background-color: rgb(0 0 0 / 50%);

    &:hover {
      background-color: rgb(0 0 0 / 50%);
    }

    &::marker {
      color: white;
    }
  }

  .wrapper {
    padding-left: 1rem;
  }

  ul {
    list-style-type: none;
    padding: 0;
    box-sizing: border-box;
    height: calc(100vh - 162px);
    overflow-y: scroll;
    overflow-x: hidden;

    li {
      position: relative;
      background-color: white;
      color: black;
      border-bottom: 1px solid #cececf;
      padding: 1rem;
      box-sizing: border-box;

      &:hover {
        transition: all .2s;
        //border: 1px solid rgba(#cececf, 1);
      }
    }
  }
}
</style>
