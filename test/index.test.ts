import allowList from '../src'

jest.mock('os', () => ({
  homedir: () => __dirname
}))

describe('Single string', () => {
  test('empty string', () => {
    const list = allowList('')
    expect(list.allow('Have a good day')).toEqual(true)
    expect(list.allow('Have A Good Day')).toEqual(true)
  })
  test('case sensitive', () => {
    const list = allowList('good')
    expect(list.allow('Have a good day')).toEqual(true)
    expect(list.allow('Have A Good Day')).toEqual(false)
  })
  test('case insensitive', () => {
    const list = allowList('good', true)
    expect(list.allow('Have a good day')).toEqual(true)
    expect(list.allow('Have A Good Day')).toEqual(true)
  })
})

describe('Single regex', () => {
  test('case sensitive', () => {
    const list = allowList(/good/)
    expect(list.allow('Have a good day')).toEqual(true)
    expect(list.allow('Have A Good Day')).toEqual(false)
  })
  test('case insensitive', () => {
    const list = allowList(/good/i)
    expect(list.allow('Have a good day')).toEqual(true)
    expect(list.allow('god')).toEqual(false)
    expect(list.allow('Have A Good Day')).toEqual(true)
  })
})

describe('Pattern list', () => {
  test('with case sensitive strings', () => {
    const list = allowList([
      /good/,
      'suite dream',
      'imagine.jpg'
    ])
    expect(list.allow('Have a good day')).toEqual(true)
    expect(list.allow('Suite dreams')).toEqual(false)
    expect(list.allow('suite')).toEqual(false)
    expect(list.allow('suite dreams')).toEqual(true)
    expect(list.allow('imagine jpg')).toEqual(false)
    expect(list.allow('imagine.jpg')).toEqual(true)
  })
  test('with case insensitive strings', () => {
    const list = allowList([
      /good/,
      'suite dream',
      'imagine.jpg'
    ], true)
    expect(list.allow('Have a good day')).toEqual(true)
    expect(list.allow('Suite dreams')).toEqual(true)
    expect(list.allow('suite')).toEqual(false)
    expect(list.allow('suite dreams')).toEqual(true)
    expect(list.allow('imagine jpg')).toEqual(false)
    expect(list.allow('imagine.jpg')).toEqual(true)
  })
})

describe('Accept function', () => {
  test('list of valid tokens', () => {
    const list = allowList(
      value => ['good', 'suite', 'imagine'].some(pattern => value.includes(pattern))
    )
    expect(list.allow('Have a good day')).toEqual(true)
    expect(list.allow('Suite dreams')).toEqual(false)
    expect(list.allow('suite')).toEqual(true)
    expect(list.allow('suite dreams')).toEqual(true)
    expect(list.allow('imagine jpg')).toEqual(true)
    expect(list.allow('imagine.jpg')).toEqual(true)
  })
})

describe('Accept object', () => {
  test('with reject function', () => {
    const list = allowList({
      reject: 'bad'
    })
    expect(list.allow('Have a bad day')).toEqual(false)
    expect(list.allow('Suite dreams')).toEqual(true)
    expect(list.allow('suite')).toEqual(true)
    expect(list.allow('suite dreams')).toEqual(true)
    expect(list.allow('imagine jpg')).toEqual(true)
    expect(list.allow('imagine.jpg')).toEqual(true)
  })
  test('with accept function', () => {
    const list = allowList({
      accept: [
        /good/,
        'suite dream',
        'imagine.jpg'
      ]
    })
    expect(list.allow('Have a bad day')).toEqual(false)
    expect(list.allow('Suite dreams')).toEqual(false)
    expect(list.allow('suite')).toEqual(false)
    expect(list.allow('suite dreams')).toEqual(true)
    expect(list.allow('imagine jpg')).toEqual(false)
    expect(list.allow('imagine.jpg')).toEqual(true)
  })

  test('with accept and reject function', () => {
    const list = allowList({
      accept: [
        /good/,
        'suite dream',
        'imagine.jpg'
      ],
      reject: /bad/i
    })
    expect(list.allow('it is a good thing to undersand someones BAD day and try to undersand her')).toEqual(false)
    expect(list.allow('Suite dreams')).toEqual(false)
    expect(list.allow('suite')).toEqual(false)
    expect(list.allow('suite dreams')).toEqual(true)
    expect(list.allow('imagine jpg')).toEqual(false)
    expect(list.allow('imagine.jpg')).toEqual(true)
  })
})
