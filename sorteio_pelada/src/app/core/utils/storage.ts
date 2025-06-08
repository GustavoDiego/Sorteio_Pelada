export const storage = {
  get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null
    const value = localStorage.getItem(key)
    try {
      return value ? (JSON.parse(value) as T) : null
    } catch {
      return null
    }
  },

  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(key, JSON.stringify(value))
  },

  remove(key: string): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(key)
  },

  clear(): void {
    if (typeof window === 'undefined') return
    localStorage.clear()
  }
}
