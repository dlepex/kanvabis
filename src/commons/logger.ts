import { SSL_OP_SINGLE_DH_USE } from "constants";

export type LoggerFn = (message?: any, ...rest: any[]) => void

export class Loggers {
  private _handlers: Array<[string, LoggerFn]> = []

  constructor() {
    this.add('console')
  }

  add(prefix: string, handler: LoggerFn = console.log): Loggers {
    this._handlers.push([prefix, handler])
    return this
  }

  get(name: string = 'console'): [LoggerFn, boolean] {
    const pair = this._handlers.find(pair => name.startsWith(pair[0]));
    return pair ? [pair[1], true] : [emptyLoggerFn, false]
  }
}

function emptyLoggerFn() {
  // do nothing
}

interface HasLoggerConfig {
  __GLOBAL_LOGGERS_CONFIG__: Loggers
}

export function loggers(): Loggers {
  const glob: HasLoggerConfig = (window || global) as any
  let cfg = glob.__GLOBAL_LOGGERS_CONFIG__
  if (cfg === undefined) {
    cfg = new Loggers()
    glob.__GLOBAL_LOGGERS_CONFIG__ = cfg
  }
  return cfg
}
