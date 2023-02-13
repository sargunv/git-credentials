[![NPM](https://img.shields.io/npm/v/git-credentials)](https://www.npmjs.com/package/git-credentials)
[![CI](https://img.shields.io/github/actions/workflow/status/sargunv/git-credentials/ci.yml)](https://github.com/sargunv/git-credentials/actions/workflows/ci.yml)
[![Codecov](https://img.shields.io/codecov/c/github/sargunv/git-credentials?token=WEHUGPYIIX)![License](https://img.shields.io/npm/l/git-credentials)](https://app.codecov.io/gh/sargunv/git-credentials/)
![Node](https://img.shields.io/node/v/git-credentials)
![ESM](https://img.shields.io/badge/module%20type-esm-brightgreen)

# git-credentials

Library to access the git credential API by wrapping the `git credential`
command.

One common use case is to automagically extract the user's saved GitHub token to
use in a tool that interacts with the GitHub API.

Requires `git` to be installed and available in the `PATH`.

For more details, read the
[git credential documentation](https://git-scm.com/docs/git-credential).

## Usage

<!-- !test program node --input-type=module -->

### git credential fill

<!-- !test check fill -->

```ts
import { gitCredentialFill } from "git-credentials"

await gitCredentialFill(
  {
    protocol: "https",
    host: "github.com",
    path: "example/repo.git", // optional
    username: "example-username", // optional
  },
  { askpass: "true" }, // optional, sets GIT_ASKPASS
)

// alternative input format

await gitCredentialFill(
  { url: "https://example-username@github.com/example/repo.git" },
  { askpass: "true" },
)
```

The above examples will return:

```js
{
  protocol: 'https',
  host: 'github.com',
  username: 'example-username',
  password: 'example-password'
}
```

### git credential approve

<!-- !test check approve -->

```mjs
import { gitCredentialApprove } from "git-credentials"

await gitCredentialApprove({
  protocol: "https",
  host: "github.com",
  path: "example/repo.git", // optional
  username: "example-username",
  password: "example-password",
})
```

### git credential reject

<!-- !test check reject -->

```mjs
import { gitCredentialReject } from "git-credentials"

await gitCredentialReject({
  protocol: "https",
  host: "github.com",
  path: "example/repo.git", // optional
  username: "example-username",
  password: "example-password",
})
```
