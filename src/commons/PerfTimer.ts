import { LoggerFn } from "./logger";

export function newPerfTimer(name: string) { return new PerfTimerImpl(name) }
export function newPerfTimerDisabled(name: string) { return DummyPerfTimer }

export interface PerfTimer {
  start(): void
  stop(): void
  printDuration(): void
}

class PerfTimerImpl {
  dur = 0
  t1: number
  constructor(public name: string) { }

  start() {
    this.t1 = performance.now()
  }

  restart() {
    this.dur = 0
    this.start()
  }

  stop() {
    this.dur += (performance.now() - this.t1)
    this.t1 = 0
  }

  toString() {
    return `Duration ${this.name} = ${this.dur} ms`
  }
}

const DummyPerfTimer = {
  start() { },
  stop() { },
  printDuration() { },
}


