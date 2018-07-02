
import * as os from 'os'
import * as path from 'path'
import { Task } from './task';
import { Worker, WorkerOptions } from 'worker_threads';
import { pick } from './utils';
import { WorkerMessage, ZoneMessage } from './message';

export interface Options {
    workers: number
}

export const default_options: Options = {
    workers: os.cpus.length
}

export const default_worker_options: Pick<WorkerOptions, 'stdout' | 'stdin' | 'stderr'> = {
    stderr: true, stdout: true, stdin: true,
}

export class Zone {
    private readonly workers: Map<number, Worker> = new Map()
    private readonly tasks: Map<number, Task<any>> = new Map()
    private readonly queue: Map<number, Task<any>> = new Map()

    private __id__: number = 0

    constructor(filename: string, options?: Partial<Options & Pick<WorkerOptions, 'stdout' | 'stdin' | 'stderr'>>) {
        const zone_options: Options = options
            ? Object.assign(default_options, pick(options, 'workers'))
            : default_options

        const worker_options: Pick<WorkerOptions, 'stdout' | 'stdin' | 'stderr'> = options
            ? Object.assign({}, pick(default_worker_options, 'stdout', 'stdin', 'stderr'))
            : default_worker_options

        for (let i = 0; i < zone_options.workers; i++) {

            const worker = new Worker(path.join(__dirname, 'worker_boot.js'), worker_options)
            this.workers.set(worker.threadId, worker)

            worker.on('online', () => {
                const message: ZoneMessage = { type: 'INIT', filename }
            })

            worker.on('message', (message: WorkerMessage) => {
                if (message.type === 'READY') {
                    if (this.queue.size >= 0) {
                        const task = this.queue.values().next().value
                        this.queue.delete(task.id)
                        const message: ZoneMessage = { type: 'EXECUTE', task: pick(task, 'id', 'func_name', 'args') }
                        worker.postMessage(message)
                    }
                } else if (message.type === 'RESULT') {
                    const task = this.tasks.get(message.id)
                    if (task) {
                        this.tasks.delete(task.id)
                        message.ok ? task.__resolve__(message.value) : task.__reject__(message.error)
                    }
                } 
            })
        }
    }

    execute<T = any>(func_name: string, args?: any[]): Task<T> {
        const id = ++this.__id__
        const task = new Task<T>(id, func_name, args)
        this.tasks.set(id, task)
        this.queue.set(id, task)
        return task
    }

}