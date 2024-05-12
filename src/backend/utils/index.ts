import {crypto} from '../deps.ts'

/**
 * 是否在deploy中运行代码
 */
export function runInDenoDeploy() {
    const deploymentId = Deno.env.get("DENO_DEPLOYMENT_ID");
    return !!deploymentId;
}

function stringify(data: unknown) {
    return JSON.stringify(data);
}

export function jsonResponse(data: unknown) {
    return new Response(
        stringify(data),
        {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        },
    );
}

export async function readReqBody(req: Request): Promise<string> {
    const formData = await req.formData()
    if (!formData.has('file')) {
        throw new Error('file字段必填')
    }
    const file = formData.get('file')!
    if (typeof file === 'string') {
        throw new Error('file字段必须是文件')
    }

    return new Promise(resolve => {
        const reader = new FileReader()
        reader.addEventListener('load', () => {
            resolve(reader.result as string)
        }, false)
        reader.readAsText(file)
    })
}

export function computeHash(data: string, algorithm = 'md5') {
    return crypto.createHash(algorithm).update(data, 'utf-8').digest('hex')
}
