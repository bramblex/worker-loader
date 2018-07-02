
declare module 'worker_threads' {

    import { EventEmitter } from "events";
    import { Readable, Writable } from "stream";

    export const isMainThread: boolean
    export const parentPort: MessagePort | null

    export const threadId: number

    export const workerData: any

    export class MessageChannel {
        constructor()
        readonly port1: MessagePort
        readonly port2: MessagePort
    }

    export type MessagePortEvent
        = 'close' | 'message'

    export class MessagePort extends EventEmitter {
        on(event: 'close', callback: () => any): this
        on(event: 'message', callback: (value: any) => any): this
        start(): void
        close(): void
        postMessage(value: any, ...transferList: Object[]): void
        ref(): void
        unref(): void
    }

    export interface WorkerOptions {
        eval: boolean
        workerData: any
        stdin: boolean
        stdout: boolean
        stderr: boolean
    }

    export type WorkerEvent 
        = 'error' | 'exit' | 'message' | 'online'

    export class Worker extends EventEmitter {

        readonly stderr: Readable
        readonly stdin: Writable
        readonly stdout: Readable
        readonly threadId: number

        constructor(filename: string, options?: Partial<WorkerOptions>)
        postMessage(value: any, ...transferList: Object[]): void
        ref(): void
        unref(): void

        terminate(callback?: Function): void

        on(event: 'error', callback: (reason: any) => any): this
        on(event: 'exit', callback: (exitCode: number) => any): this
        on(event: 'message', callback: (value: any) => any): this
        on(event: 'online', callback: () => any): this

    }

}