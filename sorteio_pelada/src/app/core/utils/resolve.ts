import { environment } from '../../../environments/environment'

function resolve(
  target: string,
  args?: { [k: string]: any } | any,
  keep: boolean = true
): string {
  const data: string[] = target.split('://')
  let host: string, endpoint: string

  if (data.length === 1) {
    host = 'api'
    endpoint = data[0]
  } else {
    host = data[0]
    endpoint = data[1]
  }

  const hostConfig = environment.hosts[host]
  let port = hostConfig.port
  if (port && !port.startsWith(':')) {
    port = ':' + port
  }

  let root = hostConfig.root
  if (root?.startsWith('/')) root = root.slice(1)
  if (root?.endsWith('/')) root = root.slice(0, -1)

  const path = hostConfig.endpoints[endpoint]
  const targets = path?.match(/:\w+/g)

  if (args && typeof args === 'object' && Object.keys(args).length) {
    args = { ...args }
  } else {
    if (!targets || !targets.length) {
      args = {}
    } else if (args) {
      const arg = args
      args = {}
      args[targets[0].replace(':', '')] = arg
    }
  }

  endpoint = replace(path || '', args, keep)

  const baseUrl = `${hostConfig.protocol}://${hostConfig.host}${port ?? ''}`
  const fullPath = [root, endpoint].filter(Boolean).join('/')

  return `${baseUrl}/${fullPath}`
}

function replace(base: string, params: any = {}, keep: boolean = true): string {
  for (const key of Object.keys(params)) {
    let value = params[key]
    if (typeof value === 'object' && value !== null) {
      value = Array.isArray(value)
        ? flattenArray(key, value)
        : flattenObject(value)
    }

    if (value === null || value === undefined) value = ''

    const next = base.replace(new RegExp(`:${key}`, 'g'), value)
    if (base !== next) delete params[key]
    base = next
  }

  if (Object.keys(params).length > 0 && keep) {
    base += base.includes('?') ? '&' : '?'
    base += flattenObject(params)
  }

  return base
}

function flattenObject(
  object: any,
  pairSeparator: string = '&',
  kvSeparator: string = '='
): string {
  const strings: string[] = []

  for (const key of Object.keys(object)) {
    const value = object[key]
    if (value === null || value === undefined) continue

    strings.push(
      Array.isArray(value)
        ? flattenArray(key, value)
        : `${key}${kvSeparator}${value}`
    )
  }

  return strings.join(pairSeparator)
}

function flattenArray(key: string, array: string[]): string {
  return array.map((d) => `${key}=${d}`).join('&')
}

export { resolve }
