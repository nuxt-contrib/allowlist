export type Matcher<T> = (value: T) => boolean
export type Pattern = string | RegExp
export type AllowRejectOptions = Partial<{
  accept: Pattern | Pattern[],
  reject: Pattern | Pattern[]
}>
export type Options<T> = AllowRejectOptions | Pattern | Pattern[] | Matcher<T>

const REGEX_RULES = [
  { matcher: /[\\$.|*+(){^]/g, replacer: (match: string) => `\\${match}` }
]

const regexCache: { [key :string]: RegExp } = {}
function makeRegex (pattern: Pattern, ignorecase: boolean): RegExp {
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

function createMatcher<T> (options: Pattern | Pattern[] | Matcher<T>, ignorecase: boolean = false, matchAll: boolean = false): Matcher<T> {
  if (typeof options === 'function') {
    return options as Matcher<T>
  }

  if (Array.isArray(options)) {
    const patterns = options.map(option => makeRegex(option, ignorecase))
    return (value: T) => {
      const stringValue = String(value)
      if (matchAll) {
        return patterns.every(pattern => pattern.test(stringValue))
      }
      return patterns.some(pattern => pattern.test(stringValue))
    }
  }

  return createMatcher([options], ignorecase, matchAll)
}

export function allowList<T> (options: Options<T>, ignorecase: boolean = false): Matcher<T> {
  let accept = (_value: T) => true
  let reject = (_value: T) => false

  if (options) {
    if (typeof options === 'object' && !(options instanceof RegExp) && !Array.isArray(options)) {
      const object = options as AllowRejectOptions
      accept = object.accept ? createMatcher(object.accept, ignorecase) : accept
      reject = object.reject ? createMatcher(object.reject, ignorecase, true) : reject
    } else {
      accept = createMatcher(options, ignorecase)
    }
  }

  return (value: T) => accept(value) && !reject(value)
}

export default allowList
