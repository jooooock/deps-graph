import {parseModules} from "../src/backend/ast.ts";

const source = Deno.readTextFileSync('input/index.js')

const modules = parseModules(source)
// console.log(modules)
console.log(Object.keys(modules).length)
