export const proxyHost = import.meta.env.MODE === 'development' ? 'http://localhost:8000' : ''

export function sleep(duration: number) {
    return new Promise(resolve => setTimeout(resolve, duration))
}


export function padLeft(data: number | string, len: number = 3, char = '0') {
    return String(data).padStart(len, char)
}
