const fs = require('node:fs')
const path = require('node:path')
const j = require('jscodeshift').withParser('babylon')


const source = fs.readFileSync(path.resolve(__dirname, '../input/index.js'), 'utf-8')

const root = j(source)

function handle(root) {
    root
        .find(j.StringLiteral)
        .forEach(path => {
            path.replace(j.stringLiteral(path.value.value))
        })
}

handle(root)
