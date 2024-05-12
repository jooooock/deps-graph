import {defineStore} from "pinia";
import {reactive, ref} from "vue";
import {ModuleEntry} from "@/types";
import type {Element, Node, Edge} from '@vue-flow/core'
import {sleep} from "@/utils/index";

export const useElementStore = defineStore('elements', () => {
    const nodes = reactive<Node[]>([])
    const edges = reactive<Edge[]>([])


    async function init(root: ModuleEntry, deps: ModuleEntry[]) {
        nodes.length = 0
        edges.length = 0

        await sleep(10)

        // add root node
        nodes.push({
            id: root.id,
            label: root.id,
            type: 'input',
            position: {x: 250, y: 5}
        })

        let x = 5
        // add deps node
        deps.forEach(dep => {
            nodes.push({
                id: dep.id,
                label: dep.id,
                position: {x: x, y: 100}
            })
            x += 20
        })

        // add edges
    }

    return {
        nodes,
        edges,
        init,
    }
})
