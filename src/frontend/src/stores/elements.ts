import {defineStore} from "pinia";
import {reactive} from "vue";
import {ModuleEntry} from "@/types";
import type {Node, Edge} from '@vue-flow/core'
import {baseURL, sleep} from "@/utils/index";
import {useModuleStore} from "@/stores/modules";

const GRID_SIZE = 20

export const useElementStore = defineStore('elements', () => {
    const nodes = reactive<Node[]>([])
    const edges = reactive<Edge[]>([])

    const moduleStore = useModuleStore()


    async function init(root: ModuleEntry, deps: ModuleEntry[]) {
        nodes.length = 0
        edges.length = 0

        await sleep(10)

        // add root node
        nodes.push({
            type: 'custom',
            id: root.id,
            label: root.id,
            class: deps.length > 0 ? '' : 'leaf',
            position: {x: 0, y: 0},
            data: {
                ...root,
                expand: true,
            },
        })

        const startX = -10 * GRID_SIZE * (Math.min(10, deps.length) - 1) / 2
        const startY = GRID_SIZE * 16
        addDepsNode(root.id,{x: startX, y: startY}, deps)
    }

    function addDepsNode(rootId: string, rootPos: {x: number, y: number}, deps: ModuleEntry[]) {
        let x = 0
        let y = 0
        let current = 0

        // add deps node
        deps.forEach(dep => {
            let row = Math.floor(current / 10)
            let col = current % 10
            x = rootPos.x + col * (GRID_SIZE * 10)
            y = rootPos.y + row * (GRID_SIZE * 4)
            if (!nodes.find(_ => _.id === dep.id)) {
                nodes.push({
                    type: 'custom',
                    id: dep.id,
                    label: dep.id,
                    class: dep.isLeaf ? 'leaf' : '',
                    position: {x: x, y: y},
                    data: {
                        ...dep,
                        expand: false,
                    },
                })
            }
            current++

            edges.push({
                id: `e${rootId}-${dep.id}`,
                source: rootId,
                target: dep.id,
                animated: true,
            })
        })
    }

    function removeNode(id: string) {
        // 检查是否还有其他连线
        if (edges.find(_ => _.target === id)) {
            return;
        }

        const nodeIdx = nodes.findIndex(_ => _.id === id)!
        const node = nodes[nodeIdx]
        nodes.splice(nodeIdx, 1)
        if (node.data.isLeaf) {
            return
        } else {
            const _edges = edges.filter(edge => edge.source === id)

            // 删除边
            _edges.forEach(edge => {
                const idx = edges.findIndex(_ => _.id === edge.id)
                edges.splice(idx, 1)
                removeNode(edge.target)
            })
        }
    }

    async function toggle(data: ModuleEntry & {expand: boolean}) {
        const rootNode = nodes.find(_ => _.id === data.id)
        const rootId = data.id
        if (data.expand) {
            // 加载子节点
            fetch(`${baseURL}/api/modules/deps?id=${data.id}&hash=${moduleStore.uuid}`).then(resp => resp.json()).then(resp => {
                const {code, data, message} = resp
                if (code === 0) {
                    const startX = rootNode!.position.x + -10 * GRID_SIZE * (Math.min(10, data.length) - 1) / 2
                    const startY = rootNode!.position.y + GRID_SIZE * 16
                    addDepsNode(rootId, {x: startX, y: startY}, data)
                } else {
                    alert(message)
                }
            })
        } else {
            // 删除子节点
            const _edges = edges.filter(edge => edge.source === data.id)
            _edges.forEach(edge => {
                const idx = edges.findIndex(_ => _.id === edge.id)
                edges.splice(idx, 1)

                removeNode(edge.target)
            })
        }
    }

    return {
        nodes,
        edges,
        init,
        toggle,
    }
})
