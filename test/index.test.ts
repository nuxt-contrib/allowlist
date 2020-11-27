import allowList from '../src'

jest.mock('os', () => ({
  homedir: () => __dirname
}))

describe('Single string', () => {
  test('empty string', () => {
    const allow = allowList<string>('')
    expect(allow('Have a good day')).toEqual(true)
    expect(allow('Have A Good Day')).toEqual(true)
  })
  test('case sensitive', () => {
    const allow = allowList<string>('good')
    expect(allow('Have a good day')).toEqual(true)
    expect(allow('Have A Good Day')).toEqual(false)
  })
  test('case insensitive', () => {
    const allow = allowList<string>('good', true)
    expect(allow('Have a good day')).toEqual(true)
    expect(allow('Have A Good Day')).toEqual(true)
  })
})

describe('Single regex', () => {
  test('case sensitive', () => {
    const allow = allowList<string>(/good/)
    expect(allow('Have a good day')).toEqual(true)
    expect(allow('Have A Good Day')).toEqual(false)
  })
  test('case insensitive', () => {
    const allow = allowList<string>(/good/i)
    expect(allow('Have a good day')).toEqual(true)
    expect(allow('god')).toEqual(false)
    expect(allow('Have A Good Day')).toEqual(true)
  })
})

describe('Pattern list', () => {
  test('with case sensitive strings', () => {
    const allow = allowList<string>([
      /good/,
      'suite dream',
      'imagine.jpg'
    ])
    expect(allow('Have a good day')).toEqual(true)
    expect(allow('Suite dreams')).toEqual(false)
    expect(allow('suite')).toEqual(false)
    expect(allow('suite dreams')).toEqual(true)
    expect(allow('imagine jpg')).toEqual(false)
    expect(allow('imagine.jpg')).toEqual(true)
  })
  test('with case insensitive strings', () => {
    const allow = allowList<string>([
      /good/,
      'suite dream',
      'imagine.jpg'
    ], true)
    expect(allow('Have a good day')).toEqual(true)
    expect(allow('Suite dreams')).toEqual(true)
    expect(allow('suite')).toEqual(false)
    expect(allow('suite dreams')).toEqual(true)
    expect(allow('imagine jpg')).toEqual(false)
    expect(allow('imagine.jpg')).toEqual(true)
  })
})

describe('Accept function', () => {
  test('list of valid tokens', () => {
    const allow = allowList<string>(
      value => ['good', 'suite', 'imagine'].some(pattern => value.includes(pattern))
    )
    expect(allow('Have a good day')).toEqual(true)
    expect(allow('Suite dreams')).toEqual(false)
    expect(allow('suite')).toEqual(true)
    expect(allow('suite dreams')).toEqual(true)
    expect(allow('imagine jpg')).toEqual(true)
    expect(allow('imagine.jpg')).toEqual(true)
  })
})

describe('Accept object', () => {
  test('with reject function', () => {
    const allow = allowList<string>({
      reject: 'bad'
    })
    expect(allow('Have a bad day')).toEqual(false)
    expect(allow('Suite dreams')).toEqual(true)
    expect(allow('suite')).toEqual(true)
    expect(allow('suite dreams')).toEqual(true)
    expect(allow('imagine jpg')).toEqual(true)
    expect(allow('imagine.jpg')).toEqual(true)
  })
  test('with accept function', () => {
    const allow = allowList<string>({
      accept: [
        /good/,
        'suite dream',
        'imagine.jpg'
      ]
    })
    expect(allow('Have a bad day')).toEqual(false)
    expect(allow('Suite dreams')).toEqual(false)
    expect(allow('suite')).toEqual(false)
    expect(allow('suite dreams')).toEqual(true)
    expect(allow('imagine jpg')).toEqual(false)
    expect(allow('imagine.jpg')).toEqual(true)
  })

  test('with accept and reject function', () => {
    const allow = allowList<string>({
      accept: [
        /good/,
        'suite dream',
        'imagine.jpg'
      ],
      reject: /bad/i
    })
    expect(allow('it is a good thing to undersand someones BAD day and try to undersand her')).toEqual(false)
    expect(allow('Suite dreams')).toEqual(false)
    expect(allow('suite')).toEqual(false)
    expect(allow('suite dreams')).toEqual(true)
    expect(allow('imagine jpg')).toEqual(false)
    expect(allow('imagine.jpg')).toEqual(true)
  })
})
