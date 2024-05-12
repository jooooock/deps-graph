import {defineStore} from "pinia";
import {computed, reactive, ref} from "vue";
import {ModuleEntry} from "@/types";

export const useModuleStore = defineStore('modules', () => {
    const _modules = reactive<ModuleEntry[]>([])
    const _filter = ref('')
    const _uuid = ref('')

    const filteredModules = computed(() => {
        if (_filter.value) {
            const q = _filter.value.toLowerCase()
            return _modules.filter(module => {
                if (module.id.includes(q) || module.comments && module.comments.some(comment => comment.toLowerCase().includes(q))) {
                    return true
                } else {
                    return false
                }
            })
        } else {
            return _modules
        }
    })

    function init(uuid: string, modules: ModuleEntry[]) {
        _uuid.value = uuid
        _modules.length = 0
        _modules.push(...modules)
    }

    function search(keyword: string) {
        _filter.value = keyword.trim()
    }

    return {
        uuid: _uuid,
        modules: filteredModules,
        init,
        search,
    }
})
