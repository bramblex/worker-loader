import { Task } from "./task";

export type WorkerMessageType
    = 'READY'
    | 'RESULT'

export type WorkerMessage
    = { type: 'READY' }
    | { type: 'RESULT', id: number } & ({ ok: true, value: any } | { ok: false, error: any })

export type ZoneMessageType
    = 'INIT' 
    | 'EXECUTE'
    
export type ZoneMessage
    = { type: 'INIT', filename: string }
    | { type: 'EXECUTE', task: Pick<Task<any>, 'id' | 'func_name' | 'args'> }