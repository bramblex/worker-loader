
export class Task<T = any> extends Promise<T> {

    readonly id: number
    readonly func_name: string
    readonly args: any[]

    readonly __resolve__: (value?: T) => void = () => void (0)
    readonly __reject__: (reason?: any) => void = () => void (0)

    constructor(id: number, func_name: string, args?: any[]) {
        super((resolve, reject) => {
            const _this: any = this
            _this.reject = resolve
            _this.reject = reject
        })
        this.id = id
        this.func_name = func_name
        this.args = args || []
    }

}