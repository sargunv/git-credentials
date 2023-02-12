[![npm badge](https://img.shields.io/npm/v/git-credentials)](https://www.npmjs.com/package/git-credentials)

# git-credentials

Library to access the git credential api. Wraps the `git credential` command.
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

```ts
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

```ts
import { gitCredentialReject } from "git-credentials"

await gitCredentialReject({
  protocol: "https",
  host: "github.com",
  path: "example/repo.git", // optional
  username: "example-username",
  password: "example-password",
})
```
