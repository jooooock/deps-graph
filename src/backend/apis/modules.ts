import {type ModuleEntry, parseModules, findDeps} from "../ast.ts";
import {computeHash, jsonResponse, readReqBody} from "../utils/index.ts";
import {Omit} from "ast-types/types";

const _cache: Record<string, Record<string, ModuleEntry>> = {}


export async function parse(req: Request) {
    try {
        const source = await readReqBody(req)

        const hash = computeHash(source)
        if (!_cache[hash]) {
            _cache[hash] = parseModules(source)
        }

        const modules = _cache[hash]

        // 删除fn字段，因为不可序列化
        const mods: Record<string, Omit<ModuleEntry, 'fn'>> = {}
        Object.keys(modules).forEach(key => {
            const module = modules[key]
            mods[key] = {
                sort: module.sort,
                id: module.id,
                isLeaf: module.isLeaf,
                comments: module.comments,
            }
        })

        return jsonResponse({
            code: 0,
            data: {
                id: hash,
                modules: mods
            },
            message: 'success'
        })
    } catch (e) {
        return jsonResponse({code: -1, message: e.message})
    }
}

export function deps(req: Request) {
    const query = new URL(req.url).searchParams;
    const id = query.get('id') || "";
    const hash = query.get('hash') || "";

    if (!id.trim() || !hash.trim()) {
        return jsonResponse({code: -1, message: '参数错误'})
    }

    const modules = _cache[hash]
    if (!modules) {
        return jsonResponse({code: -1, message: '缓存已丢失，请重新解析'})
    }

    const deps = findDeps(modules, id).map(dep => {
        return {
            sort: dep.sort,
            id: dep.id,
            isLeaf: dep.isLeaf,
            comments: dep.comments,
        }
    })

    return jsonResponse({code: 0, data: deps, message: 'success'})
}
