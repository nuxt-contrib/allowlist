interface AllowList {
  allow: (value: string) => boolean;
  accept: (value: string) => boolean;
  reject: (value: string) => boolean;
}

type allowFunction = (value: string) => boolean
type pattern = string | RegExp
type AllowListObjectOption = Partial<{
  accept: pattern | pattern[],
  reject: pattern | pattern[]
}>
type AllowOptions = AllowListObjectOption | pattern | pattern[] | allowFunction

const REGEX_RULES = [
  { matcher: /[\\$.|*+(){^]/g, replacer: (match: string) => `\\${match}` }
]

const regexCache: { [key :string]: RegExp } = {}
function makeRegex (pattern: string | RegExp, ignorecase: boolean): RegExp {
  if (pattern instanceof RegExp) {
    return pattern
  }

  const cacheKey = pattern + ignorecase

  if (!regexCache[cacheKey]) {
    const source = REGEX_RULES.reduce(
      (prev, { matcher, replacer }) => prev.replace(matcher, replacer),
      pattern
    )
    regexCache[cacheKey] = new RegExp(source, ignorecase ? 'i' : undefined)
  }
  return regexCache[cacheKey]
}

function getFunction (options: any, ignorecase: boolean): allowFunction {
  if (typeof options === 'function') {
    return options
  }

  if (Array.isArray(options)) {
    const patterns = options.map(option => makeRegex(option, ignorecase))
    return (value: string) => {
      return !!patterns.some(pattern => pattern.test(value))
    }
  }

  return getFunction([options], ignorecase)
}

export function allowList (options: AllowOptions, ignorecase: boolean = false): AllowList {
  const allow = {
    accept: (_value: string) => true,
    reject: (_value: string) => false,
    allow: (value: string) => allow.accept(value) && !allow.reject(value)
  }
  if (!options) {
    return allow
  }

  if (typeof options === 'object' && !(options instanceof RegExp) && !Array.isArray(options)) {
    const object = options as AllowListObjectOption
    allow.accept = object.accept ? getFunction(object.accept, ignorecase) : allow.accept
    allow.reject = object.reject ? getFunction(object.reject, ignorecase) : allow.reject
  } else {
    allow.accept = getFunction(options, ignorecase)
  }

  return allow
}

export default allowList
