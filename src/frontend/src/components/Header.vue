<script lang="ts" setup>
import {ref} from "vue";
import {useModuleStore} from "@/stores/modules";
import {ModuleEntry} from "@/types";
import {baseURL} from "@/utils";

let file = ref<File | null>(null)

const moduleStore = useModuleStore()

function onFileChange(e: any) {
  const files: FileList = e.target.files || e.dataTransfer.files
  file.value = files[0]

  setTimeout(startParse, 0)
}

let loading = ref(false)
function startParse() {
  const formData = new FormData()
  formData.append('file', file.value!)

  loading.value = true
  fetch(`${baseURL}/api/modules/parse`, {
    method: 'post',
    body: formData,
  }).then(resp => resp.json()).then(resp => {
    const {code, data, message} = resp
    if (code === 0) {
      const modules = Object.values(data.modules) as ModuleEntry[]
      moduleStore.init(data.id, modules.sort((a,b) => a.sort > b.sort ? 1 : -1))
    } else {
      alert(message)
    }
  }).finally(() => {
    loading.value = false
  })
}

</script>

<template>
  <div class="hstack p-2 gap-2 bg-light border-bottom">
    <input
        type="file"
        @change="onFileChange"
        class="form-control"
        accept=".js"
        style="width: 50ch"
    />
    <button
        class="btn btn-success px-4"
        :disabled="!file || loading"
        @click="startParse"
    >
      <span
          v-if="loading"
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
      ></span>
      解析
    </button>
  </div>
</template>
