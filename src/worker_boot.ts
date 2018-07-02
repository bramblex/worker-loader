import { parentPort } from "worker_threads";
import { ZoneMessage, WorkerMessage } from "./message";

if (parentPort) {
    let worker_module: { [key: string]: Function } = <any>null
    let ready_loop: NodeJS.Timer = <any>null

    const parent = parentPort
    const ready: WorkerMessage = { type: 'READY' }

    parent.on('message', (message: ZoneMessage) => {

        if (message.type === 'INIT') {

            worker_module = require(message.filename)
            ready_loop = setInterval(() => parent.postMessage(ready), 6)

        } else if (message.type === 'EXECUTE') {
            const { task: { id, func_name, args } } = message
            try {
                const result: WorkerMessage = { type: 'RESULT', id, ok: true, value: worker_module[func_name].apply(null, args) }
                parent.postMessage(result)
            } catch (error) {
                const result: WorkerMessage = { type: 'RESULT', id, ok: false, error }
                parent.postMessage(result)
            }
        }

    })

}