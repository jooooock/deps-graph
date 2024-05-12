const fs = require('node:fs')
const path = require('node:path')
const j = require('jscodeshift').withParser('babylon')


const source = fs.readFileSync(path.resolve(__dirname, '../input/index.js'), 'utf-8')

const root = j(source)

function parseModules(root) {
    const modules = {}
    const __modulesNode = root.findVariableDeclarators('__modules')
    if (__modulesNode.length > 0) {
        const node = __modulesNode.nodes()[0]
        if (node.init.type === 'ObjectExpression') {
            node.init.properties.forEach(prop => {
                modules[prop.key.value] = {
                    id: prop.key.value.toString(),
                    fn: prop.value,
                    comment: prop.leadingComments?.map(_ => _.value.trim()),
                    isLeaf: prop.value.params.length < 3,
                }
            })
        }
    }
    return modules
}

function findDeps(modules, id) {
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
        arguments(args) {
            return args.length === 1 && args[0].type === 'NumericLiteral'
        }
    })

    return calls.nodes().map(_ => {
        const depId = _.arguments[0].extra.raw
        return modules[depId]
    })
}

function handle(root) {
    const modules = parseModules(root)
    const deps = findDeps(modules, '64982')
    console.log(deps)
}

handle(root)
