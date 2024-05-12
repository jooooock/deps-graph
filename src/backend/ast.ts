import jscodeshift, {
    CallExpression,
    Collection,
    CommentLine,
    FunctionExpression,
    Node,
    ObjectProperty
} from "jscodeshift"
const j = jscodeshift.withParser('babylon')


export interface ModuleEntry {
    sort: number
    id: string
    comments: string[] | undefined
    isLeaf: boolean
    fn: FunctionExpression
}


export function parseModules(source: string) {
    const root: Collection = j(source)
    const modules: Record<string, ModuleEntry> = {}
    const __modulesNode = root.findVariableDeclarators('__modules')
    if (__modulesNode.length > 0) {
        const node = __modulesNode.nodes()[0]
        if (node.init.type === 'ObjectExpression') {
            let index = 0
            node.init.properties.forEach((prop: ObjectProperty) => {
                modules[prop.key.value] = {
                    sort: index++,
                    id: prop.key.value.toString(),
                    fn: prop.value,
                    comments: prop.leadingComments?.map((_: CommentLine) => _.value.trim()),
                    isLeaf: prop.value.params.length < 3,
                }
            })
        }
    }
    return modules
}

export function findDeps(modules: Record<string, ModuleEntry>, id: string): ModuleEntry[] {
    const module = modules[id]
    if (module.isLeaf) {
        return []
    }

    const requireFnName = module.fn.params[2].name
    const fnBody = module.fn.body
    const calls = j(fnBody).find(j.CallExpression, {
        callee: {
            name: requireFnName
        },
        arguments(args: Node) {
            return args.length === 1 && args[0].type === 'NumericLiteral'
        }
    })

    return calls.nodes().map((_: CallExpression) => {
        const depId: string = _.arguments[0].extra.raw
        return modules[depId]
    })
}

// function handle(root) {
//     const modules = parseModules(root)
//     const deps = findDeps(modules, '64982')
//     console.log(deps)
// }
