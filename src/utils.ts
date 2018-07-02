

export function pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
    const result = {}
    for (const key in keys) {
        if (obj[<K>key]) (<Pick<T, K>>result)[<K>key] = obj[<K>key]
    }
    return <Pick<T, K>>result
}