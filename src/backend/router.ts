import {getDeployments} from "./apis/info.ts";
import {deps, parse} from "./apis/modules.ts";

type APIHandler = (req: Request) => Response | Promise<Response>

const config: Record<string, APIHandler> = {
    '/api/deployments': getDeployments,
    '/api/modules/parse': parse,
    '/api/modules/deps': deps,
}

/**
 * 处理前端api请求
 * @param api
 * @param req
 */
export function routeApi(api: string, req: Request) {
    if (api in config) {
        return config[api](req)
    } else {
        return new Response(null, {
            status: 502,
        })
    }
}
