[![NPM](https://img.shields.io/npm/v/git-credentials)](https://www.npmjs.com/package/git-credentials)
[![CI](https://img.shields.io/github/actions/workflow/status/sargunv/git-credentials/ci.yml)](https://github.com/sargunv/git-credentials/actions/workflows/ci.yml)
[![Codecov](https://img.shields.io/codecov/c/github/sargunv/git-credentials?token=WEHUGPYIIX)](https://app.codecov.io/gh/sargunv/git-credentials/)
[![License](https://img.shields.io/npm/l/git-credentials)](https://github.com/sargunv/git-credentials/blob/main/LICENSE)
[![Node](https://img.shields.io/node/v/git-credentials)](https://github.com/sargunv/git-credentials/blob/main/package.json)
[![ESM](https://img.shields.io/badge/module%20type-esm-brightgreen)](https://github.com/sargunv/git-credentials/blob/main/package.json)

# git-credentials

This library wraps the `git credential` command to make it easy to interact with
the git-credential API. It requires `git` to be installed and available in the
`PATH`.

One common use case is to automagically extract the user's saved GitHub token to
use in a tool that interacts with the GitHub API.

For more details, read the [git credential documentation][git-credential].

## Usage

All `gitCredential*` functions have a `cwd` option to set the working directory
where the `git credential` commands will be run.

### git credential fill

From the [git-credential documentation][git-credential]:

> If the action is `fill`, git-credential will attempt to add "username" and
> "password" attributes to the description by reading config files, by
> contacting any configured credential helpers, or by prompting the user.

```ts
import { gitCredentialFill } from "git-credentials"

await gitCredentialFill(
  {
    protocol: "https",
    host: "example.com",
    path: "example/repo.git", // optional
    username: "example-username", // optional
  },
  {
    // optional but recommended, sets GIT_ASKPASS
    askpass: "true",
  },
)
```

The above example will return:

```js
{
  protocol: 'https',
  host: 'example.com',
  username: 'example-username',
  password: 'example-password'
}
```

This function has some additional options:

- `askpass: string`
  - Sets [`GIT_ASKPASS`][git-env-askpass]. If not provided, it'll be inherited
    from the environment. I recommend setting it to `true` (a command that does
    nothing and exits with code 0) unless you want the user to be prompted for
    their credentials in certain contexts (for example in a VSCode terminal). If
    unset, `gitCredentialFill` will throw when `git` fails to fill a password.
- `terminalPrompt: boolean`
  - Sets [`GIT_TERMINAL_PROMPT`][git-env-terminal-prompt]. If not provided,
    it'll be inherited from the environment. If `GIT_ASKPASS` is set and
    successful, git will not show the prompt regardless of this setting.

### git credential approve

From the [git-credential documentation][git-credential]:

> If the action is `approve`, git-credential will send the description to any
> configured credential helpers, which may store the credential for later use.

```mjs
import { gitCredentialApprove } from "git-credentials"

await gitCredentialApprove({
  protocol: "https",
  host: "example.com",
  path: "example/repo.git", // optional
  username: "example-username",
  password: "example-password",
})
```

### git credential reject

From the [git-credential documentation][git-credential]:

> If the action is `reject`, git-credential will send the description to any
> configured credential helpers, which may erase any stored credential matching
> the description.

```mjs
import { gitCredentialReject } from "git-credentials"

await gitCredentialReject({
  protocol: "https",
  host: "example.com",
  path: "example/repo.git", // optional
  username: "example-username",
  password: "example-password",
})
```

[git-credential]: https://git-scm.com/docs/git-credential
[git-env-askpass]:
  https://git-scm.com/docs/git#Documentation/git.txt-codeGITASKPASScode
[git-env-terminal-prompt]:
  https://git-scm.com/docs/git#Documentation/git.txt-codeGITTERMINALPROMPTcode
