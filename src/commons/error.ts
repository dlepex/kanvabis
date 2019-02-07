
export function assert(cond: boolean, msg: string | (() => string), ...args: any[]) {
  if (!cond) {
    let m = (typeof msg === 'function') ? msg() : msg
    throw assertFailed(m)
  }
}
export function nonNull<T>(value: T | undefined | null, valueName?: string): T {
  if (value == null) {
    let m = `Value ${valueName} is _undefined_ or _null_`
    throw assertFailed(m)
  }
  return value!!
}

export function invalidArg(arg: string, expectedValueMsg: string, gotValue?: any): Error {
  let m = `Invalid argument '${arg}': ${expectedValueMsg}`
  if (gotValue !== undefined) {
    m += `. got: ${gotValue}`
  }
  return new Error(m)
}

export function assertFailed(msg: string): Error {
  return new Error(`Assert failed ${msg}`)
}
