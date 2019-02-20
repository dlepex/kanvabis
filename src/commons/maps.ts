
export function computeIfAbsent<K, V>(m: Map<K, V>, k: K, fn: (key: K) => V): V {
  let v = m.get(k)
  if (v !== undefined) return v
  v = fn(k)
  m.set(k, v)
  return v
}
