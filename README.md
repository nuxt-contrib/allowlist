# Allowlist

> Easy way to allow good values and deny bads

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions][github-actions-src]][github-actions-href]
[![Codecov][codecov-src]][codecov-href]

## Install

Install using npm or yarn:

```bash
npm i allowlist
# or
yarn add allowlist
```

Import into your Node.js project:

```js
// CommonJS
const allowlist = require('allowlist')

// ESM
import allowlist from 'allowlist'
```

## Usage

**Create a list:**
```js
// Allow a good string
const aList = allowlist('good')

// Allow a good string ignore case
const aList = allowlist('good', true)

// Allow a better regex
const aList = allowlist(/better/)

// Allow list of good values
const aList = allowlist([
    'good',
    /better/,
    /best/i
])

// Allow good values with your logic
const aList = allowlist((value) => {
    return value.includes('good')
})

// Deny bad values
const aList = allowlist({
    reject: [
        'bad',
        /awful/,
        /worse/i
    ]
})

// Allow good values and deny bads
const aList = allowlist({
    accept: [
        'good',
        /better/,
        /best/i
    ],
    reject: [
        'bad',
        /awful/,
        /worse/i
    ]
})
```

**Check for good:**
```js
if (aList.allow('Sometimes good things fall apart so better things can fall together.')) {
    // cool stuff
}
```


## License

MIT. Made with 💖

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/allowlist?style=flat-square
[npm-version-href]: https://npmjs.com/package/allowlist

[npm-downloads-src]: https://img.shields.io/npm/dm/allowlist?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/allowlist

[github-actions-src]: https://img.shields.io/github/workflow/status/farnabaz/allowlist/ci/master?style=flat-square
[github-actions-href]: https://github.com/farnabaz/allowlist/actions?query=workflow%3Aci

[codecov-src]: https://img.shields.io/codecov/c/gh/farnabaz/allowlist/master?style=flat-square
[codecov-href]: https://codecov.io/gh/farnabaz/allowlist
